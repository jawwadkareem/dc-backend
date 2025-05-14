// const connectToDatabase = require("../../utils/db")
// const Task = require("../../models/Task")

// module.exports = async (req, res) => {
//   res.setHeader("Access-Control-Allow-Origin", "*")
//   res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS")
//   res.setHeader("Access-Control-Allow-Headers", "Content-Type")

//   if (req.method === "OPTIONS") {
//     return res.status(200).end()
//   }

//   if (req.method !== "GET") {
//     return res.status(405).json({ error: "Method not allowed" })
//   }

//   try {
//     await connectToDatabase()

//     // Get total counts
//     const totalTasks = await Task.countDocuments()
//     const completedTasks = await Task.countDocuments({ completed: true })
//     const pendingTasks = totalTasks - completedTasks

//     // Get tasks by priority
//     const highPriorityTasks = await Task.countDocuments({ priority: "high" })
//     const mediumPriorityTasks = await Task.countDocuments({ priority: "medium" })
//     const lowPriorityTasks = await Task.countDocuments({ priority: "low" })

//     // Get tasks by category
//     const categories = await Task.aggregate([
//       { $group: { _id: "$category", count: { $sum: 1 } } },
//       { $sort: { count: -1 } },
//     ])

//     // Get upcoming due tasks (next 7 days)
//     const today = new Date()
//     const nextWeek = new Date(today)
//     nextWeek.setDate(today.getDate() + 7)

//     const upcomingTasks = await Task.countDocuments({
//       dueDate: { $gte: today, $lte: nextWeek },
//       completed: false,
//     })

//     // Get overdue tasks
//     const overdueTasks = await Task.countDocuments({
//       dueDate: { $lt: today },
//       completed: false,
//     })

//     return res.status(200).json({
//       total: totalTasks,
//       completed: completedTasks,
//       pending: pendingTasks,
//       priority: {
//         high: highPriorityTasks,
//         medium: mediumPriorityTasks,
//         low: lowPriorityTasks,
//       },
//       categories,
//       upcoming: upcomingTasks,
//       overdue: overdueTasks,
//     })
//   } catch (err) {
//     console.error(err)
//     return res.status(500).json({ error: "Failed to fetch statistics" })
//   }
// }

const connectToDatabase = require("../../utils/db")
const Task = require("../../models/Task")
const auth = require("../../middleware/auth")

module.exports = async (req, res) => {
  // Update the CORS headers to allow requests from your frontend domain
  res.setHeader("Access-Control-Allow-Origin", "https://distributed-computing-cep.vercel.app")
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS")
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization")
  res.setHeader("Access-Control-Allow-Credentials", "true")

  if (req.method === "OPTIONS") {
    return res.status(200).end()
  }

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  try {
    // Authenticate user
    let user
    try {
      user = await auth(req)
    } catch (error) {
      return res.status(401).json({ error: "Authentication failed" })
    }

    await connectToDatabase()

    // Get total counts for this user
    const totalTasks = await Task.countDocuments({ user: user._id })
    const completedTasks = await Task.countDocuments({ user: user._id, completed: true })
    const pendingTasks = totalTasks - completedTasks

    // Get tasks by priority for this user
    const highPriorityTasks = await Task.countDocuments({ user: user._id, priority: "high" })
    const mediumPriorityTasks = await Task.countDocuments({ user: user._id, priority: "medium" })
    const lowPriorityTasks = await Task.countDocuments({ user: user._id, priority: "low" })

    // Get tasks by category for this user
    const categories = await Task.aggregate([
      { $match: { user: user._id } },
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ])

    // Get upcoming due tasks (next 7 days) for this user
    const today = new Date()
    const nextWeek = new Date(today)
    nextWeek.setDate(today.getDate() + 7)

    const upcomingTasks = await Task.countDocuments({
      user: user._id,
      dueDate: { $gte: today, $lte: nextWeek },
      completed: false,
    })

    // Get overdue tasks for this user
    const overdueTasks = await Task.countDocuments({
      user: user._id,
      dueDate: { $lt: today },
      completed: false,
    })

    return res.status(200).json({
      total: totalTasks,
      completed: completedTasks,
      pending: pendingTasks,
      priority: {
        high: highPriorityTasks,
        medium: mediumPriorityTasks,
        low: lowPriorityTasks,
      },
      categories,
      upcoming: upcomingTasks,
      overdue: overdueTasks,
    })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: "Failed to fetch statistics" })
  }
}

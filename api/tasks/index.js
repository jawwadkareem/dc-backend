// // index.js (in /api/tasks/index.js)

// const connectToDatabase = require('../../utils/db');
// const Task = require('../../models/Task');

// module.exports = async (req, res) => {
//   res.setHeader('Access-Control-Allow-Origin', '*');
//   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
//   res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

//   if (req.method === 'OPTIONS') {
//     return res.status(200).end();
//   }

//   await connectToDatabase();

//   if (req.method === 'GET') {
//     const tasks = await Task.find();
//     return res.status(200).json(tasks);
//   }

//   if (req.method === 'POST') {
//     const { title, id, action } = req.body;

//     try {
//       if (action === 'toggle') {
//         const task = await Task.findById(id);
//         if (!task) return res.status(404).json({ error: 'Task not found' });

//         task.completed = !task.completed;
//         await task.save();
//         return res.status(200).json(task);
//       }

//       if (action === 'delete') {
//         await Task.findByIdAndDelete(id);
//         return res.status(200).json({ message: 'Task deleted' });
//       }

//       // Default action: Create
//       if (title) {
//         const newTask = new Task({ title });
//         await newTask.save();
//         return res.status(201).json(newTask);
//       }

//       return res.status(400).json({ error: 'Invalid request body' });
//     } catch (err) {
//       return res.status(500).json({ error: 'Server error' });
//     }
//   }

//   return res.status(405).end(); // Method Not Allowed
// };

// index.js (in /api/tasks/index.js)

const connectToDatabase = require("../../utils/db")
const Task = require("../../models/Task")

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*")
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
  res.setHeader("Access-Control-Allow-Headers", "Content-Type")

  if (req.method === "OPTIONS") {
    return res.status(200).end()
  }

  await connectToDatabase()

  if (req.method === "GET") {
    try {
      // Support filtering
      const { category, priority, completed, search } = req.query
      
      let query = {}
      
      if (category) query.category = category
      if (priority) query.priority = priority
      if (completed !== undefined) query.completed = completed === 'true'
      if (search) query.title = { $regex: search, $options: 'i' }
      
      const tasks = await Task.find(query).sort({ createdAt: -1 })
      return res.status(200).json(tasks)
    } catch (err) {
      return res.status(500).json({ error: "Failed to fetch tasks" })
    }
  }

  if (req.method === "POST") {
    const { title, description, priority, category, dueDate, id, action } = req.body

    try {
      if (action === "toggle") {
        const task = await Task.findById(id)
        if (!task) return res.status(404).json({ error: "Task not found" })

        task.completed = !task.completed
        await task.save()
        return res.status(200).json(task)
      }

      if (action === "delete") {
        await Task.findByIdAndDelete(id)
        return res.status(200).json({ message: "Task deleted" })
      }
      
      if (action === "update") {
        const task = await Task.findById(id)
        if (!task) return res.status(404).json({ error: "Task not found" })
        
        if (title) task.title = title
        if (description !== undefined) task.description = description
        if (priority) task.priority = priority
        if (category) task.category = category
        if (dueDate) task.dueDate = new Date(dueDate)
        
        await task.save()
        return res.status(200).json(task)
      }

      // Default action: Create
      if (title) {
        const newTask = new Task({ 
          title,
          description: description || "",
          priority: priority || "medium",
          category: category || "general",
          dueDate: dueDate ? new Date(dueDate) : null
        })
        await newTask.save()
        return res.status(201).json(newTask)
      }

      return res.status(400).json({ error: "Invalid request body" })
    } catch (err) {
      console.error(err)
      return res.status(500).json({ error: "Server error" })
    }
  }

  return res.status(405).end() // Method Not Allowed
}

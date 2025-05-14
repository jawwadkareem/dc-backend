const connectToDatabase = require("../../utils/db")
const User = require("../../models/User")

module.exports = async (req, res) => {
  // Update the CORS headers to allow requests from your frontend domain
  res.setHeader("Access-Control-Allow-Origin", "https://distributed-computing-cep.vercel.app")
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS")
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization")
  res.setHeader("Access-Control-Allow-Credentials", "true")

  if (req.method === "OPTIONS") {
    return res.status(200).end()
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  try {
    await connectToDatabase()
    const { name, email, password } = req.body

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ error: "Please provide all required fields" })
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ error: "User with this email already exists" })
    }

    // Create new user
    const user = new User({
      name,
      email,
      password,
    })

    await user.save()

    // Return user without password
    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    }

    return res.status(201).json(userResponse)
  } catch (error) {
    console.error("Registration error:", error)
    return res.status(500).json({ error: "Server error during registration" })
  }
}

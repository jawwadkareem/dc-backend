const jwt = require("jsonwebtoken")
const connectToDatabase = require("../../utils/db")
const User = require("../../models/User")

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*")
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS")
  res.setHeader("Access-Control-Allow-Headers", "Content-Type")

  if (req.method === "OPTIONS") {
    return res.status(200).end()
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  try {
    await connectToDatabase()
    const { email, password } = req.body

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ error: "Please provide email and password" })
    }

    // Find user
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" })
    }

    // Check password
    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" })
    }

    // Create JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || "your-secret-key", { expiresIn: "7d" })

    // Return user and token
    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
    }

    return res.status(200).json({
      user: userResponse,
      token,
    })
  } catch (error) {
    console.error("Login error:", error)
    return res.status(500).json({ error: "Server error during login" })
  }
}

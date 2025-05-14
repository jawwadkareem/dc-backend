const jwt = require("jsonwebtoken")
const connectToDatabase = require("../../utils/db")
const User = require("../../models/User")

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
    // Get token from header
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "No token provided" })
    }

    const token = authHeader.split(" ")[1]

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key")

    await connectToDatabase()

    // Get user from database
    const user = await User.findById(decoded.userId).select("-password")
    if (!user) {
      return res.status(404).json({ error: "User not found" })
    }

    return res.status(200).json(user)
  } catch (error) {
    console.error("Auth error:", error)
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ error: "Invalid token" })
    }
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Token expired" })
    }
    return res.status(500).json({ error: "Server error" })
  }
}

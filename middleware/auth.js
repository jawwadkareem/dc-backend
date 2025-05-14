const jwt = require("jsonwebtoken")
const User = require("../models/User")
const connectToDatabase = require("../utils/db")

const auth = async (req) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new Error("No token provided")
    }

    const token = authHeader.split(" ")[1]

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key")

    await connectToDatabase()

    // Get user from database
    const user = await User.findById(decoded.userId).select("-password")
    if (!user) {
      throw new Error("User not found")
    }

    return user
  } catch (error) {
    throw error
  }
}

module.exports = auth

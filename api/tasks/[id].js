const connectToDatabase = require('../../utils/db');
const Task = require('../../models/Task');

module.exports = async (req, res) => {
  // Set CORS headers for all responses
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    await connectToDatabase();
    const { id } = req.query;

    if (req.method === 'PUT') {
      const task = await Task.findById(id);
      if (!task) {
        return res.status(404).json({ error: 'Task not found' });
      }
      task.completed = !task.completed;
      await task.save();
      return res.status(200).json(task);
    }

    if (req.method === 'DELETE') {
      const task = await Task.findById(id);
      if (!task) {
        return res.status(404).json({ error: 'Task not found' });
      }
      await Task.findByIdAndDelete(id);
      return res.status(200).json({ message: 'Task deleted' });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('Server error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
};
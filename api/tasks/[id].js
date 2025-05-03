const connectToDatabase = require('../../utils/db');
const Task = require('../../models/Task');

module.exports = async (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Connect to MongoDB
  await connectToDatabase();

  const { id } = req.query;

  if (req.method === 'PUT') {
    try {
      const task = await Task.findById(id);
      if (!task) return res.status(404).json({ error: 'Task not found' });

      task.completed = !task.completed;
      await task.save();
      return res.status(200).json(task);
    } catch (err) {
      return res.status(500).json({ error: 'Failed to update task' });
    }
  }

  if (req.method === 'DELETE') {
    try {
      await Task.findByIdAndDelete(id);
      return res.status(200).json({ message: 'Task deleted' });
    } catch (err) {
      return res.status(500).json({ error: 'Failed to delete task' });
    }
  }

  return res.status(405).end(); // Method Not Allowed
};

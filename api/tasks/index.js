// index.js (in /api/tasks/index.js)

const connectToDatabase = require('../../utils/db');
const Task = require('../../models/Task');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  await connectToDatabase();

  if (req.method === 'GET') {
    const tasks = await Task.find();
    return res.status(200).json(tasks);
  }

  if (req.method === 'POST') {
    const { title, id, action } = req.body;

    try {
      if (action === 'toggle') {
        const task = await Task.findById(id);
        if (!task) return res.status(404).json({ error: 'Task not found' });

        task.completed = !task.completed;
        await task.save();
        return res.status(200).json(task);
      }

      if (action === 'delete') {
        await Task.findByIdAndDelete(id);
        return res.status(200).json({ message: 'Task deleted' });
      }

      // Default action: Create
      if (title) {
        const newTask = new Task({ title });
        await newTask.save();
        return res.status(201).json(newTask);
      }

      return res.status(400).json({ error: 'Invalid request body' });
    } catch (err) {
      return res.status(500).json({ error: 'Server error' });
    }
  }

  return res.status(405).end(); // Method Not Allowed
};

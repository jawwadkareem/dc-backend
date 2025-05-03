// const connectToDatabase = require('../../utils/db');
// const Task = require('../../models/Task');

// module.exports = async (req, res) => {
//     res.setHeader('Access-Control-Allow-Origin', '*');
//     res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
//     res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

//   if (req.method === 'OPTIONS') {
//     return res.status(200).end();
//   }

//   if (req.method !== 'POST') {
//     return res.status(405).json({ error: 'Method not allowed' });
//   }

//   await connectToDatabase();
//   const { id } = req.query;
//   const { action } = req.body;

//   try {
//     if (action === 'toggle') {
//       const task = await Task.findById(id);
//       if (!task) return res.status(404).json({ error: 'Task not found' });

//       task.completed = !task.completed;
//       await task.save();
//       return res.status(200).json(task);
//     }

//     if (action === 'delete') {
//       await Task.findByIdAndDelete(id);
//       return res.status(200).json({ message: 'Task deleted' });
//     }

//     return res.status(400).json({ error: 'Invalid action' });
//   } catch (err) {
//     return res.status(500).json({ error: 'Server error' });
//   }
// };

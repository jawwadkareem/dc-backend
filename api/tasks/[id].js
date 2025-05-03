const connectToDatabase = require('../../utils/db');
const Task = require('../../models/Task');

module.exports = async (req, res) => {
  await connectToDatabase();
  const { id } = req.query;

  if (req.method === 'PUT') {
    const task = await Task.findById(id);
    task.completed = !task.completed;
    await task.save();
    res.status(200).json(task);
  } else if (req.method === 'DELETE') {
    await Task.findByIdAndDelete(id);
    res.status(200).json({ message: 'Task deleted' });
  } else {
    res.status(405).end(); // Method Not Allowed
  }
};

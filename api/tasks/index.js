const connectToDatabase = require('../../utils/db');
const Task = require('../../models/Task');

module.exports = async (req, res) => {
  await connectToDatabase();

  if (req.method === 'GET') {
    const tasks = await Task.find();
    res.status(200).json(tasks);
  } else if (req.method === 'POST') {
    const { title } = req.body;
    const newTask = new Task({ title });
    await newTask.save();
    res.status(201).json(newTask);
  } else {
    res.status(405).end(); // Method Not Allowed
  }
};

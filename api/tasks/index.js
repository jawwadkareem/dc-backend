const connectToDatabase = require('../../utils/db');
const Task = require('../../models/Task');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
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
    const { title } = req.body;
    const newTask = new Task({ title });
    await newTask.save();
    return res.status(201).json(newTask);
  }

  return res.status(405).end(); // Method Not Allowed
};

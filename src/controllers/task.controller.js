const Task = require('../models/task.model');

const findAllTasks = async (req, res) => {
    try {
        const userId = req.user._id;
        const tasks = await Task.find({ userId });
        const tasksWithUserId = tasks.map(task => ({
            id: task._id,
            title: task.title,
            description: task.description
        }));
        res.status(200).json(tasksWithUserId);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createTask = async (req, res) => {
    try {
        const userId = req.user._id;
        const { title, description } = req.body;
        const task = new Task({ title, description, userId });
        await task.save();

        const taskWithUserId = {
            id: task._id,
            title: task.title,
            description: task.description
        };
        res.status(201).json(taskWithUserId);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const findTaskById = async (req, res) => {
    try {
        const userId = req.user._id;
        const id = req.params.id;

        const task = await Task.findOne({ _id: id, userId: userId });
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        const taskWithUserId = {
            id: task._id,
            title: task.title,
            description: task.description
        };
        res.status(200).json(taskWithUserId);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateTask = async (req, res) => {
    try {
        const userId = req.user._id;
        const id = req.params.id;
        const { title, description } = req.body;

        const task = await Task.findOneAndUpdate({ _id: id, userId: userId }, { title, description },
            { new: true }
        );
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        const taskWithUserId = {
            id: task._id,
            title: task.title,
            description: task.description
        };
        res.status(200).json(taskWithUserId);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const deleteTask = async (req, res) => {
    try {
        const userId = req.user._id;
        const id = req.params.id;
        const task = await Task.findOneAndDelete({ _id: id, userId: userId });
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    findAllTasks,
    createTask,
    findTaskById,
    updateTask,
    deleteTask
};
const Task = require('../models/task.model');

const findAllTasks = async (req, res) => {
    try {
        const userId = req.user._id;
        const tasks = await Task.find({ userId }).sort({ createdAt: -1 });
        const tasksWithUserId = tasks.map(task => ({
            id: task._id,
            title: task.title,
            description: task.description,
            createdAt: task.createdAt
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

        const existingTask = await Task.findOne({ title, userId });
        if (existingTask) {
            return res.status(409).json({ message: 'Task with this title already exists' });
        }
        
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
            return res.status(404).json({ message: 'Task of user not found, please check the task ID and your user ID' });
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

        const existingTask = await Task.findOne({ title, userId, _id: { $ne: id } });
        if (existingTask) {
            return res.status(409).json({ message: 'Task with this title already exists' });
        }

        const task = await Task.findOneAndUpdate({ _id: id, userId: userId }, { title, description },
            { new: true }
        );
        if (!task) {
            return res.status(404).json({ message: 'Task of user not found, please check the task ID and your user ID' });
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
            return res.status(404).json({ message: 'Task of user not found, please check the task ID and your user ID' });
        }
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const countTasks = async (req, res) => {
    try {
        const userId = req.user._id;
        const count = await Task.countDocuments({ userId });
        res.status(200).json({ count });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    findAllTasks,
    createTask,
    findTaskById,
    updateTask,
    deleteTask,
    countTasks
};
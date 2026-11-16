const express = require('express');
const { findAllTasks, createTask, findTaskById, updateTask, deleteTask, countTasks } = require('../controllers/task.controller');
const authMiddleware = require('../middleware/auth.middleware');
const { createTaskValidator, taskIdValidator, updateTaskValidator } = require('../validators/task.validator');

const taskRouter = express.Router();

taskRouter.get('/count', authMiddleware, countTasks);

taskRouter.get('/', authMiddleware, findAllTasks);
taskRouter.post('/', authMiddleware, createTaskValidator, createTask);
taskRouter.get('/:id', authMiddleware, taskIdValidator, findTaskById);
taskRouter.put('/:id', authMiddleware, taskIdValidator, updateTaskValidator, updateTask);
taskRouter.delete('/:id', authMiddleware, taskIdValidator, deleteTask);

module.exports = taskRouter;
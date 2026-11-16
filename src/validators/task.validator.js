const { body, param } = require('express-validator');
const { validateFields } = require('../utils/validator.util');

const createTaskValidator = [
    body('title')
        .notEmpty()
        .withMessage('Title is required')
        .isLength({ min: 3 })
        .withMessage('Title must be at least 3 characters'),

    body('description')
        .notEmpty()
        .withMessage('Description is required')
        .isLength({ min: 5 })
        .withMessage('Description must be at least 5 characters'),

    validateFields
];

const updateTaskValidator = [
    body('title')
        .optional()
        .isLength({ min: 3 })
        .withMessage('Title must be at least 3 characters'),

    body('description')
        .optional()
        .isLength({ min: 5 })
        .withMessage('Description must be at least 5 characters'),

    validateFields
];

const taskIdValidator = [
    param('id')
        .notEmpty()
        .withMessage('Task ID is required')
        .isMongoId()
        .withMessage('Task ID must be a valid Mongo ID'),

    validateFields
];

module.exports = {
    createTaskValidator,
    updateTaskValidator,
    taskIdValidator
};
const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');

router.post('/create-task', taskController.createTask);
router.put('/update-task', taskController.updateTask);
router.delete('/delete-task', taskController.softDeleteTask);
router.get('/get-user-tasks', taskController.getUserTasks);

module.exports = router;
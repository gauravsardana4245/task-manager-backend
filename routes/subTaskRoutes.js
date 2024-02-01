const express = require('express');
const router = express.Router();
const subTaskController = require('../controllers/subTaskController');

router.post('/create-subtask', subTaskController.createSubTask);
router.put('/update-subtask', subTaskController.updateSubTask);
router.delete('/delete-subtask', subTaskController.softDeleteSubTask);
router.get('/get-user-subtasks', subTaskController.getUserSubTasks);

module.exports = router;

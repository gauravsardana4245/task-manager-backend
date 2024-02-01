const Task = require('../models/taskModel');
const SubTask = require('../models/subTaskModel');
const User = require('../models/userModel');

const createTask = async (req, res) => {
  try {
    const { title, description, due_date } = req.body;
    const user_id = req.user.user_id;

    // Create the task with the associated user and default priority
    const task = await Task.create({
      title,
      description,
      due_date,
      user_id,
      associated_users: [user_id],
    });

    res.json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const updateTask = async (req, res) => {
  try {
    const { taskId } = req.query;
    const { due_date, status } = req.body;

    const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      { due_date: due_date, status: status },
      { new: true }
    );

    // updating corresponding subtasks
    await SubTask.updateMany(
      { task_id: taskId },
      { status: updatedTask.status==="DONE"? 1 : 0 }
    );

    res.json(updatedTask);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const softDeleteTask = async (req, res) => {
  try {
    const { taskId } = req.query;

    const deletedTask = await Task.findByIdAndUpdate(
      taskId,
      { deleted_at: new Date() },
      { new: true }
    );

    // Soft deleting corresponding subtasks
    await SubTask.updateMany(
      { task_id: taskId },
      { deleted_at: new Date() }
    );

    res.json(deletedTask);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getUserTasks = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { priority, dueDateStart, dueDateEnd, page = 1, pageSize = 10 } = req.query;

    // Constructing the filter object based on the provided parameters
    const filter = {
      user_id: userId,
      deleted_at: { $exists: false },
    };

    if (priority !== undefined) {
      filter.priority = priority;
    }

    if (dueDateStart !== undefined || dueDateEnd !== undefined) {
      const dueDateFilter = {};

      if (dueDateStart !== undefined) {
        dueDateFilter.$gte = new Date(dueDateStart);
      }

      if (dueDateEnd !== undefined) {
        dueDateFilter.$lte = new Date(dueDateEnd);
      }

      filter.due_date = dueDateFilter;
    }

    // Fetching tasks with pagination
    const tasks = await Task.find(filter)
      .sort({ due_date: 'asc' })
      .skip((page - 1) * pageSize)
      .limit(Number(pageSize));

    res.json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};



module.exports = {
  createTask,
  updateTask,
  softDeleteTask,
  getUserTasks
};

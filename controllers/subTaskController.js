const express = require("express")
const SubTask = require('../models/subTaskModel');

const createSubTask = async (req, res) => {
  try {
    const { task_id } = req.body;
    const subTask = await SubTask.create({ task_id });
    res.json(subTask);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const updateSubTask = async (req, res) => {
  try {
    const { subtaskId } = req.query;
    const { status } = req.body;

    const updatedSubTask = await SubTask.findByIdAndUpdate(
      subtaskId,
      { status },
      { new: true }
    );

    res.json(updatedSubTask);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const softDeleteSubTask = async (req, res) => {
  try {
    const { subtaskId } = req.query;

    const deletedSubTask = await SubTask.findByIdAndUpdate(
      subtaskId,
      { deleted_at: new Date() },
      { new: true }
    );

    res.json(deletedSubTask);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getUserSubTasks = async (req, res) => {
  try {
    const { status, task_id, page = 1, pageSize = 10 } = req.query;

    // Constructing the filter object based on the provided parameters
    const filter = {
      task_id: task_id,
      deleted_at: { $exists: false },
    };

    if (status !== undefined) {
      filter.status = status;
    }

    // Fetching subTasks with pagination
    const subTasks = await SubTask.find(filter)
      .skip((page - 1) * pageSize)
      .limit(Number(pageSize));

    res.json(subTasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
    createSubTask,
    updateSubTask,
    softDeleteSubTask,
    getUserSubTasks
}
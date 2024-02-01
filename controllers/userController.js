const express = require("express")
const Task = require('../models/taskModel');
const User = require('../models/userModel');
const bcrypt = require('bcryptjs');

const createUser = async (req, res) => {
  try {
    const { username, password, phone_number, priority } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({ username, password: hashedPassword, phone_number, priority });
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
    createUser
}
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const taskRoutes = require('./routes/taskRoutes');
const subTaskRoutes = require('./routes/subTaskRoutes');
const userRoutes = require('./routes/userRoutes');
const authenticateToken = require('./utils/authentication');
const dotenv = require('dotenv');
const mongoConnect = require("./config/db");
const { taskPriorityUpdate, voiceCall } = require('./cronJobs')

dotenv.config();

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

// Cron jobs
taskPriorityUpdate();
voiceCall();

// Routes
app.use('/api/tasks', authenticateToken, taskRoutes);
app.use('/api/subtasks', authenticateToken, subTaskRoutes);
app.use('/api/users', userRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

mongoConnect();

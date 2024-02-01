const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    due_date: { type: Date },
    status: { type: String, enum: ['TODO', 'IN_PROGRESS', 'DONE'], default: 'TODO' },
    priority: { type: Number, default: 0 },  // Priority based on due date
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },  // Associated user
    associated_users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],  // Users associated with the task
    deleted_at: { type: Date },
  }, 
  { 
    timestamps: true 
  });

module.exports = mongoose.model('Task', taskSchema);

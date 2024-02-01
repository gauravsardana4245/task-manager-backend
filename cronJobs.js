const cron = require('node-cron');
const Task = require('./models/taskModel');
const User = require('./models/userModel');
require("dotenv").config();
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioClient = require('twilio')(accountSid,authToken);

// Cron Job: Changing Priority of Task based on Due Date
const taskPriorityUpdate = () => {
cron.schedule('0 0 * * *', async () => {
  try {
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);

    await Task.updateMany(
      { deleted_at: { $exists: false }, due_date: { $lt: today } },
      { priority: 0 }
    );

    await Task.updateMany(
      { deleted_at: { $exists: false }, due_date: { $gte: tomorrow, $lt: new Date(new Date().setDate(tomorrow.getDate() + 2)) } },
      { priority: 1 }
    );

    await Task.updateMany(
      { deleted_at: { $exists: false }, due_date: { $gte: new Date(new Date().setDate(tomorrow.getDate() + 2)), $lt: new Date(new Date().setDate(tomorrow.getDate() + 5)) } },
      { priority: 2 }
    );

    await Task.updateMany(
      { deleted_at: { $exists: false }},
      { priority: 3 }
    );

    console.log('Task priorities updated based on due date.');
  } catch (error) {
    console.error(error);
  }
});
}

// Cron Job: Voice Calling using Twilio
const voiceCall = async () => {
cron.schedule('0 12 * * *', async () => {
  try {
   
    const overdueTasks = await Task.find({
      status: 'TODO',
      due_date: { $lte: new Date() },
    }).populate('associated_users');

    for (const task of overdueTasks) {
      const usersToCall = task.associated_users
        .sort((a, b) => a.priority - b.priority);

      let callSuccessful = false;

      for (const user of usersToCall) {
        const phoneNumber = user.phone_number;

          try {

            await twilioClient.calls.create({
              to: phoneNumber,
              from: '+16508521889', 
              url: 'http://demo.twilio.com/docs/voice.xml', 
            });

            // If the call is successful,we set the flag and break out of the loop
            callSuccessful = true;
            break;
          } catch (callError) {
            console.error(`Error making Twilio voice call to ${phoneNumber}:`, callError);
          }
      }
    }
  } catch (error) {
    console.error(error);
  }
});
}

module.exports = {
  taskPriorityUpdate,
  voiceCall
};

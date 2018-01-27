const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

var trialWorkoutSchema = mongoose.Schema({
  name: String,
  phone: String
});

var eventSchema = mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  max_participants: Number,
  date: { type: Date, required: true },
  sign_in: Date,
  sign_out: Date,
  participant_ids: [{ type: ObjectId, ref: 'User' }],
  allow_trials: Boolean,
  trial_workouts: [trialWorkoutSchema]
});

module.exports = mongoose.model('Event', eventSchema);

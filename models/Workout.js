const mongoose = require('mongoose');

const workoutSchema = new mongoose.Schema({
	
	title: {
	    type: String,
	    required: [true, 'Workout title is required'], // Title of the workout
	},
	description: {
	    type: String,
	    required: false,
  	},
	status: {
		type: Boolean,
		default: false, // Default: Not completed
	},
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: [false, 'User ID is required'], // Reference to the user who owns the workout
	},
});


module.exports = mongoose.model('Workout', workoutSchema);
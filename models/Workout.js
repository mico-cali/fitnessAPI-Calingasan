const mongoose = require('mongoose');

const workoutSchema = new mongoose.Schema({
	
	name: {
	    type: String,
	    required: [true, 'Workout title is required'],
	},
	duration: {
	    type: Number,
	    required: [true, 'Workout duration is required'],
  	},
	dateAdded: {
		type: Date,
		default: Date.now,
	},
	status: {
		type: String,
		// enum: ['completed', 'in-progress', 'pending'],
		required: true,
	},
	userId: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});


module.exports = mongoose.model('Workout', workoutSchema);
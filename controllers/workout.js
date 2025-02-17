const Workout = require("../models/Workout")

module.exports.addWorkout = (req, res) => {

	let newWorkout = new Workout({
		title: req.body.title,
		description: req.body.description,
		userId: req.body.userId,
		status: false,
	})

	newWorkout.save()
	.then(data => res.status(201).send(data))
	.catch(error => {
		console.error("Error in saving the workout: ", error)
		return res.status(500).send({ error: 'Failed to save item' })
	})
};

module.exports.getWorkouts = (req, res) => {
	Workout.find({})
	.then(workout => {
		if(workout.length > 0) {
			return res.status(200).send({ workout });
		} else {
			return res.status(200).send({ message: 'No data found' })
		}
	})
	.catch(error => res.status(500).send({ error: 'Error finding data.' }))
};

module.exports.updateWorkout = (req, res) => {
	// Extract the fields to be updated from the request body
	let workoutUpdates = {
		title: req.body.title,
		description: req.body.description, // Optional field
		status: req.body.status, // Optional field to update the status
	};

	// Use findByIdAndUpdate to update the workout
	return Workout.findByIdAndUpdate(req.params.id, workoutUpdates, { new: true })
	.then(updatedWorkout => {
		// no workout is found, return error
		if (!updatedWorkout) {
			return res.status(404).send({ error: 'Workout not found' });
		}

		// Successfully updated workout, return the updated workout
		return res.status(200).send({
			message: 'Workout updated successfully',
			updatedWorkout: updatedWorkout
		});
	})
	.catch(err => {
		// Log the error and return a 500 error
		console.error('Error in updating workout: ', err);
		return res.status(500).send({ error: 'Error in updating the workout.' });
	});
};

module.exports.deleteWorkout = (req, res) => {
	// Get workoutId from the request parameters
	const workoutId = req.params.id;

	// Find the workout by ID and delete it
	Workout.findByIdAndDelete(workoutId)
	.then(deletedWorkout => {
		// If no workout is found, return a 404 error
		if (!deletedWorkout) {
			return res.status(404).send({ error: 'Workout not found' });
		}

		// Successfully deleted the workout, return a success message
		return res.status(200).send({
			message: 'Workout deleted successfully',
			deletedWorkout: deletedWorkout
		})
	})
}

module.exports.completeWorkoutStatus = (req, res) => {
    const title = req.body.title;

    if (!title) {
        return res.status(400).send({ error: 'Workout Title is required' });
    }

    // Find the workout by title and update its status to true (completed)
    Workout.findOneAndUpdate({ title: title }, { status: true }, { new: true })
    .then(updatedWorkout => {
        if (!updatedWorkout) {
            return res.status(404).send({ error: 'Workout with the specified title not found' });
        }

        return res.status(200).send({
            message: 'Workout status updated to completed',
            updatedWorkout: updatedWorkout
        });
    })
    .catch(err => {
        console.error('Error in updating workout status: ', err);
        return res.status(500).send({ error: 'Error in updating workout status' });
    });
};

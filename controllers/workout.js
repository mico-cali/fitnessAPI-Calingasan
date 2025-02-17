const Workout = require("../models/Workout")

module.exports.addWorkout = (req, res) => {
    const userId = req.user.id;

    let newWorkout = new Workout({
        name: req.body.name,
        duration: req.body.duration,
        userId: userId,
        status: req.body.status || "pending",
    });

    newWorkout.save()
        .then(data => res.status(201).send({
            message: 'Workout added successfully',
            workout: data,
        }))
        .catch(error => {
            if (error.name === 'ValidationError') {
                return res.status(400).send({ error: error.message });
            }
            console.error("Error in saving the workout: ", error);
            return res.status(500).send({ error: 'Failed to save item' });
        });
};


module.exports.getWorkouts = (req, res) => {
    const userId = req.user.id;

    Workout.find({ userId: userId })
        .then(workouts => {
            res.status(200).send({
                message: 'Workouts retrieved successfully',
                workouts: workouts,
            });
        })
        .catch(error => {
            console.error("Error retrieving workouts: ", error);
            res.status(500).send({ error: 'Failed to retrieve workouts' });
        });
};


module.exports.updateWorkout = (req, res) => {
	const userId = req.user.id;
	const workoutId = req.params.id

	const updateWorkout = {};
	if(req.body.name) updateWorkout.name = req.body.name;
	if(req.body.duration) updateWorkout.duration = req.body.duration;
	if(req.body.status) updateWorkout.status = req.body.status;

	Workout.findOneAndUpdate(
		{ _id: workoutId, userId: userId },
		updateWorkout,
		{ new: true }
	)
	.then(workout => {
		if(!workout) {
			return res.status(404).send({
				success: false,
				message: "Workout not found or not authorized to update"
			})
		}
		res.status(200).send({
			success: true,
			message: "Workout updated successfully",
			workout: workout
		})
	})
	.catch(error => {
		console.error("Error updating workout: ", error);
        res.status(500).send({ error: 'Failed to update workout' });
	})
}


module.exports.deleteWorkout = (req, res) => {
	const userId = req.user.id;
    const workoutId = req.params.id;

    console.log("Attempting to delete workout with ID:", workoutId);

    // Find and delete the workout, ensuring ownership by matching `userId`
    Workout.findOneAndDelete({ _id: workoutId, userId: req.user.id })
        .then(deletedWorkout => {
            // If no workout is found, return a 404 error
            if (!deletedWorkout) {
                return res.status(404).send({ error: 'Workout not found or unauthorized' });
            }

            // Successfully deleted the workout, return a success message
            return res.status(200).send({
                message: 'Workout deleted successfully',
                workout: deletedWorkout
            });
        })
        .catch(err => {
            // Log any errors for debugging purposes
            console.error('Error in deleting workout: ', err);
            return res.status(500).send({ error: 'Error in deleting the workout' });
        });
};


module.exports.completeWorkoutStatus = (req, res) => {
    const userId = req.user.id;
    const workoutId = req.params.id;
    const completedStatus = req.body.status || "completed";


    if (!workoutId) {
        return res.status(400).send({ error: 'Workout ID is required' });
    }

    console.log("Marking workout as completed for ID:", workoutId);

    Workout.findOneAndUpdate(
        { _id: workoutId, userId: userId }, // Ensure the workout belongs to the user
        { status: completedStatus },
        { new: true } 
    )
        .then(updatedWorkout => {
            if (!updatedWorkout) {
                return res.status(404).send({ 
                	success: false,
                	error: 'Workout with the specified ID not found or unauthorized' 
                });
            }

            return res.status(200).send({
            	success: true,
                message: 'Workout status updated to completed',
                workout: updatedWorkout,
            });
        })
        .catch(error => {
            console.error('Error in updating workout status: ', error);
            return res.status(500).send({ error: 'Error in updating workout status' });
        });
};

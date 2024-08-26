import Ratings from "../models/Ratings.js";
export const postRatings = async (jobId,jobSeekerId,rating) => {
try {
    // Check if the rating for the specified job and jobseeker already exists
    const existingRating = await Ratings.findOne({ jobId, jobSeekerId });

    if (existingRating) {
        // Update the existing rating
        existingRating.rating = rating;
        await existingRating.save();
        return existingRating;
    } else {
        // Create a new rating
        const newRating = new Ratings({
            jobId,
            jobSeekerId,
            rating
        });

        await newRating.save();

        return newRating;
    }
} catch (error) {
    throw new Error('Failed to post rating');
}
}


export const getRatings = async (jobId,jobSeekerId) => {
    try {
        // Find all ratings for the specified job
        const jobRatings = await Ratings.find({ jobId,jobSeekerId });

        return jobRatings;
    } catch (error) {
        throw new Error('Failed to get job ratings');
    }
}
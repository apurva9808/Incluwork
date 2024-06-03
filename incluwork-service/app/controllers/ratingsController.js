import { postRatings,getRatings } from '../services/ratingsServices.js';

export const postJobRatings = async (req, res) => {
    try {
        const { jobId, jobSeekerId, rating } = req.body;
        const postedRating = await postRatings(jobId,jobSeekerId,rating);
        res.status(201).json(postedRating);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getJobRatings = async (req, res) =>{
        try {
            const { jobId,jobSeekerId } = req.body;
            const jobRatings = await getRatings(jobId,jobSeekerId);
            res.status(200).json(jobRatings);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
};

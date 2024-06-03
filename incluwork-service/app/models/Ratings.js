import mongoose from 'mongoose';

const ratingsSchema = new mongoose.Schema({
    id: {
        type: mongoose.Schema.Types.ObjectId,
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
        default:0,
    },
    jobId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'Job', // Reference to the Job model
        required: true
    },
    jobSeekerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'JobSeeker', // Reference to the JobSeeker model
        required: true
    }
},{
    versionKey:false
});

const Ratings = mongoose.model('Ratings', ratingsSchema);

export default Ratings;

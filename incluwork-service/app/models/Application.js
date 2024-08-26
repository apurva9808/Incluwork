import mongoose from "mongoose";
import JobSeeker from './JobSeeker.js';
import Job from './Job.js';

const applicationSchema = new mongoose.Schema({
  applicationId: {
    type: mongoose.Schema.Types.ObjectId,
  },
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Job' 
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'JobSeeker' 
  },
  employerId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Employer'
  },
  employerId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Employer' 
  },
  applicationDate: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    required: true,
    enum: ['pending','applied', 'offered', 'accepted', 'rejected', 'withdrawn'],
    default: 'pending'
  }
},
    {
      versionKey:false
    });

const Application = mongoose.model('Application', applicationSchema);

export default Application;

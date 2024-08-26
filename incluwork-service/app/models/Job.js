import mongoose from "mongoose";
import Employer from "./Employer.js";
 
const accommodationFacilitiesEnum = [
  'Screen reading software', 'Magnification tools', 'Audio Navigation Guides','Braille Display',
  'Tactile Markings', 'Assistive Listening Devices', 'Captioning Software', 'Accessible Communication Tools',
  'Sign Language Interpreters', 'Visual Cues and Graphical Representation Software', 'Visual Communication Aids',
  'Speech Generating Devices', 'Text-to-Speech Software', 'Communication Applications', 'Assistive Technology Devices',
  'Tactile Graphics Software', 'Remote Collaboration Tools', 'Ergonomic Workspace Setup', 'Collaborative Project Management Tools', 
  'Accessible Communication Platforms', 'Visual Cues for Orientation', 'Accessible Software Development Tools',
  'Accessible Transportation Facilities', 'Flexible Attendance Policies', 'Ergonomic Workstation Setup', 
  'Voice-controlled Technology Devices', 'Assistive Aids', 'Flexible Work Arrangements', 'Voice-controlled Project Management Tools',
  'Supportive Workstations and Equipment', 'Virtual Assistive Devices', 'Individualized Support Plans',
  'Wheelchair Accessible Workspace', 'Accessible Communication Tools', 'Customized Work Arrangements', 'Supportive Networks and Communities',
  'Collaborative Task Management Tools', 'Ergonomic Keyboards', 'Rest Areas and Quiet Workspaces', 'Telecommuting Facilities', 'Individualized Accommodative Facilities'
];

const jobTitlesEnum = [
  'Braille Transcriptionist', 'Customer Service Representative',
  'Blindness Rehabilitation Specialist', 'Educator', 'Graphic Designer',
  'Administrative Assistant', 'Content Creator', 'Data Entry Specialist',
  'Transcriptionist', 'Life Skills Trainer', 'Assistive Technology Specialist',
  'Rehabilitation Counselor', 'Virtual Assistant', 'Copywriter',
  'Accessibility Consultant', 'Online Tutor', 'Telecommuting Software Engineer',
  'Social Media Manager', 'Marketing Coordinator', 'Office Assistant',
  'Library Assistant', 'Food Service Worker', 'Web Designer',
  'Freelance Writer', 'Educational Assistant', 'Human Resources Assistant',
  'Consultant'
];
 
const jobSchema = new mongoose.Schema({
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
  },
  title: {
    type: String,
    required: true,
    enum : jobTitlesEnum
  },
  employerId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Employer'
  },
  location: {
    type: String,
    required: true
  },
  jobType: {
    type: String,
    required: true,
    enum: ['part-time', 'full-time']
  },
  accessibilityFeatures: {
    type: [String],
    enum: accommodationFacilitiesEnum,
    default: []
  },
  requiredSkills: {
    type: [String],
    required: true
  },
  maxPositions: {
    type: Number,
    required: true
  },
  dateOfPosting: {
    type: Date,
    default: Date.now
  },
  acceptedCandidates: {
    type: Number,
    default: 0
  },
  salary: {
    type: Number,
    required: true
  },
  dateOfJoining: {
    type: Date,
    required: true
  }
},{
  versionKey:false
});
 
const Job = mongoose.model('Job', jobSchema);
 
export default Job;

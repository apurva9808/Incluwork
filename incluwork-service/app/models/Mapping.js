import mongoose from "mongoose";

const challengesEnum = [
    'Visual Impairment', 'Hearing Impairment', 'Speech Impairment',
    'Dual Sensory Impairment', 'Vestibular Impairment', 'Paralysis',
    'Arthritis', 'Down Syndrome', 'Ehlers-Danlos Syndrome',
    'Orthopedic Disabilities'
];

const accommodationFacilitiesEnum=[
    'Screen reading software', 'Magnification tools', 'Audio Navigation Guides','Braille Display',
    'Tactile Markings', 'Assistive Listening Devices', 'Captioning Software', 'Accessible Communication Tools',
    'Sign Language Interpreters', 'Visual Cues and Graphical Representation Software', 'Visual Communication Aids',
    'Speech Generating Devices', 'Text-to-Speech Software', 'Communication Applications', 'Assistive Technology Devices',
    'Tactile Graphics Software', 'Remote Collaboration Tools', 'Ergonomic Workspace Setup', 'Collaborative Project Management Tools',
    'Accessible Communication Platforms', 'Visual Cues for Orientation', 'Accessible Software Development Tools',
    'Accessible Transportation Facilities', 'Flexible Attendance Policies', 'Ergonomic Workstation Setup',
    'Voice-controlled Technology Devices', 'Assistive Aids', 'Flexible Work Arrangements', 'Voice-controlled Project Management Tools',
    'Supportive Workstations and Equipment', 'Virtual Assistive Devices', 'Individualized Support Plans',
    'Wheelchair Accessible Workspace', 'Customized Work Arrangements', 'Supportive Networks and Communities',
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

const skillsEnum = [
    'Proficiency in Braille', 'Attention to Detail', 'Keyboarding Skills',
    'Knowledge of Accessibility Standards', 'Communication Skills',
    'Adaptive Technology Proficiency', 'Proficiency in Sign Language', 'Creativity',
    'Organizational Skills', 'Knowledge of Visual Storytelling Techniques',
    'Proficiency in Speech Recognition Software', 'Problem Solving Skills', 'Team Management Skills', 'Expertise in Accessibility Software',
    'Familiar with Sensory-aware Counseling Techniques', 'Tech Savviness', 'Flexibility', 'Adaptability', 'Accessibility Knowledge',
    'Technical Proficiency', 'Continuous Learning Skills', 'Tech Literacy', 'Visual Design Skills',
    'Strategic Thinking Skills', 'Team Collaboration Skills', 'Analytical Skills', 'Customer Care Skills',
    'Critical Thinking', 'Accessibility Awareness', 'Excellent Communication and Interpersonal Skills', 'Knowledge of Company Policies and Procedures',
    'Industry Expertise', 'Networking Abilities', 'Time Management Skills'
];

const mappingSchema = new mongoose.Schema({
    challenge: {
        type: String,
        enum: challengesEnum
    },
    accommodationFacilities: {
        type: [String],
        enum: accommodationFacilitiesEnum
    },
    jobTitles: {
        type: [String],
        enum: jobTitlesEnum
    },
    skills: {
        type: [String],
        enum: skillsEnum
    }
}, {
    versionKey: false
});

const Mapping = mongoose.model('Mapping', mappingSchema);

export default Mapping;

import mongoose from "mongoose";

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
const schema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
        companyName: {
            type: String,
            required: true,
        },
        companyProfile: {
            type: String,
        },
        inclusivityRating: {
            type: Number,
            min: 0,
            max: 5,
            default: 0,
        },
        accommodationFacilities: {
            type: [String],
            enum: accommodationFacilitiesEnum,
        }
    },
    { collation: { locale: "en" } ,
    versionKey:false},
);

const Employer = mongoose.model("Employer", schema);

export default Employer;

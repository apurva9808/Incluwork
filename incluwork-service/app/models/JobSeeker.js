import mongoose from "mongoose";
import Employer from "./Employer.js";

const challengesEnum = ['Visual Impairment', 'Hearing Impairment', 'Speech Impairment', 'Dual Sensory Impairment', 'Vestibular Impairment', 'Paralysis', 'Arthritis', 'Down Syndrome', 'Ehlers-Danlos Syndrome', 'Orthopedic Disabilities'];
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
let schema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
        education: [
            {
                institutionName: {
                    type: String,
                    required: true,
                },
                courseName: {
                    type: String,
                    required: true,
                },
                startYear: {
                    type: Number,
                    min: 1930,
                    max: new Date().getFullYear(),
                    required: true,
                    validate: Number.isInteger,
                },
                endYear: {
                    type: Number,
                    max: new Date().getFullYear(),
                    validate: [
                        {validator: Number.isInteger, msg: "Year should be an integer"},
                        {
                            validator: function (value) {
                                return this.startYear <= value;
                            },
                            msg: "End year should be greater than or equal to Start year",
                        },
                    ],
                },
            },
        ],
        skills: {
            type: [String],
            required: true,
            enum: skillsEnum,
        },
        resume: {
            type: String,
        },
        medicalProof: {
            type: String,
        },
        challenges: {
            type: [String],
            required: true,
            enum: challengesEnum,
        },
        status:{
            type:String,
            enum: ["incomplete", "pending","verified"],
            default:"incomplete"
        }
    },

    {collation: {locale: "en"},
    versionKey:false}
);

const JobSeeker = mongoose.model("JobSeeker", schema);
export default JobSeeker;

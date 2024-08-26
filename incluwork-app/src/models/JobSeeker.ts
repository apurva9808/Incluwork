import {UserType} from "./User.ts";

export interface EducationDetails {
    institutionName: string;
    courseName: string;
    startYear: number;
    endYear?: number;
}

export interface JobSeeker {
    id: string;
    userId: string;
    education: EducationDetails[];
    skills: string[];
    resume?: string;
    medicalProof?: string;
    challenges: string;
    name: string;
    email: string;
    type: UserType;
    contactNumber?: string;
    status?:string
}

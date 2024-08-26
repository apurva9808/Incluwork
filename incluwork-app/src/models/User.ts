export interface User {
    accommodationFacilities: string[];
    medicalProof: boolean;
    resume: boolean;
    id: string;
    name: string;
    email: string;
    type: UserType;
    contactNumber?: string;  // Optional based on your schema validations
}
  
export type UserType = 'employer' | 'jobseeker' | 'admin';

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface LoginResponse {
    user: User;
    token: string;
    id:string;
    type:string;
}

export interface EmployerSignUpData {
    name: string;
    email: string;
    password: string;
    contactNumber: string;
    companyName: string;
    companyProfile: string;
    accommodationFacilities: string[];
}

export interface JobSeekerSignUpData {
    name: string;
    email: string;
    contactNumber: string;
    password: string;
    skills: string[];
    experience: number;
    challenges : string;
    resumeURL: string;
    medicalproofURL : string;
    accommodationFacilities:string[];
}
export interface SignupResponse {
    user: User;
    token: string;
    id:string;
    type:string;
    message:string;
}

export type SignUpData = EmployerSignUpData | JobSeekerSignUpData;
  
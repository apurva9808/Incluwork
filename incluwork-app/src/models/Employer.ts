export interface Employer {
    id: string;
    userId: string;
    companyName: string;
    companyProfile?: string;
    inclusivityRating: number;
    accommodationFacilities: string[];
}

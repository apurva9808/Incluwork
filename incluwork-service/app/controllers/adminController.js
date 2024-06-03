import * as adminService from "../services/adminService.js";
import * as userService from "../services/userService.js";


export const getAllUsersFilter = async (req, res) => {
    const type = req.query.type; // Get the type from the request body
    try {
        const Users = await adminService.getAllUsers(type);
        res.status(200).json(Users);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};



export const getAllUsers = async (req, res) => {
        try {
            const users = await userService.fetchAllUsers();
            res.json(users);
        } catch (err) {
            res.status(500).json({ message: "Error retrieving users", error: err });
        }
    };    


export const getAllJobs = async (req, res) => {
        try {
            const jobs = await adminService.getAllJobs();
            res.status(200).json(jobs);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    };    

   

    export const getAllApplications = async (req, res) => {
        try {
            const applications = await adminService.getAllApplications();
            res.status(200).json(applications);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    };

export const verifyJobseeker = async (req, res) => {
   
    try {
        const applications = await adminService.verifyJobseeker(req.user.JSId,req.user.status);
        res.status(200).json(applications);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};




import * as uploadService from '../services/uploadService.js';
import path from 'path';


//Controller code for uploading resume
export const uploadResume = async (req, res) => {

    if (req.user.type !== "jobseeker") {
        return res.status(403).json({ message: "Access denied: User is not a jobseeker" });
    }
    const { file } = req;
    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
  
    const fileExtension = path.extname(file.originalname).toLowerCase();
    if (fileExtension !== ".pdf") {
      return res.status(400).json({ message: "Invalid format" });
    }

  try {
    const url = await uploadService.saveResume(req.user.id, file);
    res.send({ message: "Resume uploaded successfully", url: url });
  } catch (error) {
    // console.error("Error in uploadResume controller:", error);
    res.status(500).json({ message: "Error while uploading" });
  }
};

//Controller code for uploading medical proof
export const uploadProof = async (req, res) => {

    if (req.user.type !== "jobseeker") {
        return res.status(403).json({ message: "Access denied: User is not a jobseeker" });
    }
    const { file } = req;
    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const fileExtension = path.extname(file.originalname).toLowerCase();
    if (fileExtension !== ".pdf") {
      return res.status(400).json({ message: "Invalid format" });
    }

  try {
    const url = await uploadService.saveProof(req.user.id, file);
    res.send({ message: "Medical proof uploaded successfully", url: url });
  } catch (error) {
    res.status(500).json({ message: "Error while uploading" });
  }
};

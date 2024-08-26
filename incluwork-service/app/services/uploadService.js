import fs from "fs";
import { promisify } from "util";
import { v4 as uuidv4 } from "uuid";
import path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { pipeline as pipelineCallback } from "stream";
import JobSeeker from '../models/JobSeeker.js'
const pipeline = promisify(pipelineCallback);


//Function to ensure directory exists or create it if it doesn't
const ensureDirExists = (path) => {
    if (!fs.existsSync(path)) {
      fs.mkdirSync(path, { recursive: true });
    }
  };

// Getting the __dirname equivalent in ES module
const __dirname = dirname(fileURLToPath(import.meta.url));

//Service code for saving the file
export const saveFile = async (file, folder,fileExtension) => {

  const dirPath = `${__dirname}/../public/${folder}`;
  ensureDirExists(dirPath);  // Ensure the directory exists
  
 
  const filename = `${uuidv4()}${fileExtension}`;
  const filePath = `${__dirname}/../public/${folder}/${filename}`;


  console.log(file);


try {
    // Using writeFile to save the buffer to a file
    await fs.promises.writeFile(filePath, file.buffer);
    return `/host/${folder}/${filename}`;
  } catch (error) {
    console.error("Error in saveFile service:", error);
    throw new Error('Failed to save file');
  }

};

// Save resume and update the JobSeeker model
export const saveResume = async (userId, file) => {
  const fileExtension = path.extname(file.originalname).toLowerCase();
  try {
      const response = await saveFile(file, "resume", fileExtension);
      const modifiedUrl = response.replace('/host', ''); // Remove '/host' from the URL

      // Update the JobSeeker document
      await JobSeeker.findOneAndUpdate(
          { userId },
          { resume: modifiedUrl },
          { new: true }
      );
      return modifiedUrl;
  } catch (error) {
      console.error('Error uploading resume:', error);
      throw error;
  }
};

// Save medical proof and update the JobSeeker model
export const saveProof = async (userId, file) => {
  const fileExtension = path.extname(file.originalname).toLowerCase();
  try {
      const response = await saveFile(file, "medicalproof", fileExtension);
      const modifiedUrl = response.replace('/host', ''); // Remove '/host' from the URL

      // Update the JobSeeker document
      await JobSeeker.findOneAndUpdate(
          { userId },
          { medicalProof: modifiedUrl,
          status:"pending"},
          { new: true }
      );
      return modifiedUrl;
  } catch (error) {
      console.error('Error uploading medical proof:', error);
      throw error;
  }
};
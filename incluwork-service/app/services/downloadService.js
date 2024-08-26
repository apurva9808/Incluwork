import fs from "fs";
import path from "path";
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url)); // ES6 way to get __dirname

export const checkFileAndSend = async(filePath, res) => {
  const fullPath = path.join(__dirname, `../public/${filePath}`);
  
  try {
    // Check if the file exists and is accessible
    await fs.promises.access(fullPath, fs.constants.F_OK);

    // Determine the content type based on the file extension
    const fileExtension = path.extname(filePath).toLowerCase();

    // Only allow PDF files
    if (fileExtension !== '.pdf') {
        res.status(400).json({
          message: "Invalid format: Only PDF files are allowed",
        });
        return;
    }

    // If the file is a PDF, set the appropriate header
    res.setHeader('Content-Type', 'application/pdf');
    

    // Send the file
    res.sendFile(fullPath);
  } catch (err) {
    console.error(`Error accessing ${fullPath}: ${err}`);
    if (err.code === 'ENOENT') { // File not found
      res.status(404).json({ message: "File not found" });
    } else {
      res.status(500).json({ message: "Server error" });
    }
  }
};
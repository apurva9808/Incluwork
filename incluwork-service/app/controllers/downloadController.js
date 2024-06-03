import * as downloadService from '../services/downloadService.js'

export const downloadResume = async (req, res) => {
   
    const filePath = `resume/${req.params.file}`;
    downloadService.checkFileAndSend(filePath, res);
  };
  
  export const downloadProof = async (req, res) => {

    const filePath = `medicalproof/${req.params.file}`;
    downloadService.checkFileAndSend(filePath, res);
  };
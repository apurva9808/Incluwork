import express from 'express';
import dotenv from 'dotenv';
import initialize from  './app/app.js';
dotenv.config();
const app = express();
const port=3000;
 
initialize(app);
 
app.listen(port,()=> console.log(`Server running on port ${port}`));
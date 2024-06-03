import cors from 'cors';
import express from 'express';
import mongoose from 'mongoose';

import initializeRoutes from "./routes/index.js";
import passportConfig from "./lib/passportConfig.js";
import passport from "passport";

const initialize = (app) => {
    app.use(cors());
    app.use(express.json());
    app.use(express.urlencoded());
    app.use(passport.initialize());
    mongoose.connect(process.env.MONGO_CONNECTION);
    initializeRoutes(app);
}

export default initialize;
import passport from "passport";
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as JWTStrategy, ExtractJwt as ExtractJWT } from 'passport-jwt';

import User from "../models/User.js";
import { jwtSecretKey } from "./authKeys.js";

// Function to filter out unwanted keys (e.g., password) from user objects
const filterJson = (obj, unwantedKeys) => {
    const filteredObj = {};
    Object.keys(obj).forEach((key) => {
        if (!unwantedKeys.includes(key)) {
            filteredObj[key] = obj[key];
        }
    });
    return filteredObj;
};

// Configuring Passport to use a Local Strategy for email/password login
passport.use(
    new LocalStrategy(
        {
            usernameField: "email",  // Define the field in the request that passport can expect the username
            passReqToCallback: true  // Allows the entire request to be passed to the callback
        },
        (req, email, password, done) => {
            User.findOne({ email: email }).then(user => {
                if (!user) {
                    return done(null, false, { message: "User does not exist" });
                }


                user.login(password).then(() => {
                    // Filter sensitive data before sending user data
                    user = filterJson(user.toObject(), ["password", "__v"]);
                    return done(null, user);
                }).catch(err => {
                    return done(null, false, { message: "Password is incorrect." });
                });
            }).catch(err => {
                return done(err);
            });
        }
    )
);

// Configuring Passport to use a JWT Strategy for handling bearer tokens
passport.use(
    new JWTStrategy(
        {
            jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),  // Extracts the token from the Authorization header
            secretOrKey: jwtSecretKey  // The secret key used to verify the token's signature
        },
        (jwt_payload, done) => {
            User.findById(jwt_payload._id).then((user) => {
                if (!user) {
                    return done(null, false, { message: "JWT Token does not exist" });
                }

                // Optionally filter out the password and other sensitive data
                user = filterJson(user.toObject(), ["password", "__v"]);
                return done(null, user);
            }).catch(err => {
                return done(err, false, { message: "Incorrect Token" });
            });
        }
    )
);

export default passport;

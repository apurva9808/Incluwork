// authController.js
import { createUser, loginUser } from '../services/authService.js';

export const signUp = (req, res) => {
    const data = req.body;

    createUser(data)
        .then(token => res.json(token))
        .catch(err => {
            if (err.message.includes('Email is already in use')) {
                res.status(409).json({ error: 'Email is already in use' });
            } else {
                res.status(400).json({ error: err.message });
            }
        });
};

export const login = (req, res, next) => {
    const { email, password } = req.body;

    loginUser(email, password)
        .then(token => res.json(token))
        .catch(err => {
            if (err.status) {
                res.status(err.status).json({ message: err.message });
            } else {
                next(err);
            }
        });
};
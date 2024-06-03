import * as internalService from '../services/internalService.js';

// Create mapping controller
export const createMapping = async (req, res) => {
    try {
        const mapping = await internalService.createMapping(req.body);
        res.status(201).json(mapping);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// View mappings controller
export const getMappings = async (req, res) => {
    try {
        const mappings = await internalService.getMappings();
        res.json(mappings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

import Mapping from '../models/Mapping.js';

// Create mapping service
export const createMapping = async (mappingData) => {
    try {
        const mapping = await Mapping.create(mappingData);
        return mapping;
    } catch (error) {
        throw Error(`Failed to create mapping ${error.message}`);
    }
};

// Get all mappings service
export const getMappings = async () => {
    try {
        const mappings = await Mapping.find();
        return mappings;
    } catch (error) {
        throw Error('Failed to fetch mappings');
    }
};

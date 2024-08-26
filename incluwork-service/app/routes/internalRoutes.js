import express from 'express';
import * as internalController from '../controllers/internalController.js';

const router = express.Router();

// Create mapping endpoint
router.post('/mappings', internalController.createMapping);

// View mappings endpoint
router.get('/mappings', internalController.getMappings);

export default router;

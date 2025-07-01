// In TargetOwnerRoutes.js - Add missing imports and exports
import express from 'express';
import {createTarget, deleteTarget} from '../controllers/targetOwnerController.js';
import {singleUpload} from '../middleware/imageuploadmiddleware.js';
import authMiddleware from '../../Authentication/middleware/authMiddleware.js';

const router = express.Router();
router.post('/', authMiddleware, singleUpload, createTarget);
router.delete('/:targetId', authMiddleware, deleteTarget);

export default router; // Don't forget to export!
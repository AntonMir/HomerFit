import * as express from 'express';
const router = express.Router();
import trainingsController from '../controllers/trainingsController';

// История тренировок
router.get('/history', trainingsController.getAllHistory);

export default router;

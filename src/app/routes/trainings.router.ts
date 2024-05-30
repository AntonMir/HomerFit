import * as express from 'express';
const router = express.Router();
import trainingsHistoryController from '../controllers/trainings-history-controller';
import trainingsController from '../controllers/trainings-controller';

// История тренировок
router.get('/history', trainingsHistoryController.getAllHistory);
router.get('/exercises/:training_id', trainingsController.getTrainingExercises);
router.get(
    '/history/:training_id',
    trainingsHistoryController.getTrainingHistory
);
router.get('', trainingsController.getAllUsersTrainings);

export default router;

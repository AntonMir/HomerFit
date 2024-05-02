import { logger } from '../../utils/logger';
import { ITrainingHistory } from '../../interfaces/training-history.interface';
import { TrainingHistory } from '../collections/trainings-history.schema';

export class TrainingsHistoryService {
    /**
     * Сохранить тренировку в историю
     * @param training
     */
    async create(training: ITrainingHistory) {
        try {
            const insertResult = new TrainingHistory(training);
            await insertResult.save();
            return insertResult._id;
        } catch (error) {
            logger.error('TrainingsService > createTraining > ', error);
        }
    }
}

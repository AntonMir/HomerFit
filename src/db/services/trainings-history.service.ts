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

    /**
     * Получить тренировку по ID
     * @param _id
     */
    async getOneById(_id: string) {
        try {
            return TrainingHistory.findOne({ _id });
        } catch (error) {
            logger.error('TrainingsService > getOneById > ', error);
        }
    }

    /**
     * Получить историю по training ID
     * @param trainingId
     */
    async getAllByTrainingId(trainingId: string) {
        try {
            return TrainingHistory.find({ trainingId }).exec();
        } catch (error) {
            logger.error('TrainingsService > getAllByTrainingId > ', error);
        }
    }
}

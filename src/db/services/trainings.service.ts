import { TrainingsRepository } from '../repositoryes/trainings.repository';
import { logger } from '../../utils/logger';
import { ObjectId } from 'mongoose';
import { ITraining } from '../../interfaces/training.interface';

export class TrainingsService {
    private readonly trainingsRepository: TrainingsRepository;

    constructor() {
        this.trainingsRepository = new TrainingsRepository();
    }

    /**
     * Создать новую тренировку
     * @param training
     */
    async createTraining(training: ITraining) {
        try {
            return await this.trainingsRepository.insertOne(training);
        } catch (error) {
            logger.error('TrainingsService > createTraining > ', error);
        }
    }

    /**
     * Добавить упражнение в тренировку
     * @param trainingId
     * @param exerciseId
     */
    async addExercise(trainingId: ObjectId, exerciseId: ObjectId) {
        try {
            return await this.trainingsRepository.addExercise(
                trainingId,
                exerciseId
            );
        } catch (error) {
            logger.error('TrainingsService > createTraining > ', error);
        }
    }

    /**
     * Получить тренировку по id
     * @param trainingId
     */
    async getOneById(trainingId: ObjectId) {
        try {
            return await this.trainingsRepository.getOneById(trainingId);
        } catch (error) {
            logger.error('TrainingsService > createTraining > ', error);
        }
    }
}

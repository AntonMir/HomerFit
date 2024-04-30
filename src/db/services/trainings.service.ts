import { logger } from '../../utils/logger';
import { ObjectId } from 'mongoose';
import { ITraining } from '../../interfaces/training.interface';
import { Trainings } from '../collections/training.schema';

export class TrainingsService {
    /**
     * Создать новую тренировку
     * @param training
     */
    async createTraining(training: ITraining) {
        try {
            const insertResult = await Trainings.insertOne(training);
            return insertResult.insertedId;
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
        const result = await Trainings.updateOne(
            { _id: trainingId },
            { $push: { exercises: exerciseId } }
        );

        if (result && result.modifiedCount === 1) {
            return result.modifiedCount; // Количество измененных документов
        } else {
            logger.error(
                `TrainingsRepository >  addExercise > Failed to add exercise to training with ID ${trainingId}`
            );
        }
    }

    /**
     * Получить тренировку по id
     * @param _id
     */
    async getOneById(_id: ObjectId) {
        try {
            return await Trainings.findOne({ _id });
        } catch (error) {
            logger.error('TrainingsService > getOneById > ', error);
        }
    }
}

import { logger } from '../../utils/logger';
import { ObjectId } from 'mongoose';
import { ITraining } from '../../interfaces/training.interface';
import { Trainings } from '../collections/training.schema';

export class TrainingsRepository {
    async insertOne(training: ITraining) {
        try {
            const insertResult = await Trainings.insertOne(training);
            return insertResult.insertedId;
        } catch (error) {
            logger.error('TrainingsRepository > insertOne > ', error);
        }
    }

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

    async getOneById(trainingId: ObjectId) {
        try {
            return await Trainings.findOne({ _id: trainingId });
        } catch (error) {
            logger.error('TrainingsRepository > getOneById > ', error);
        }
    }
}

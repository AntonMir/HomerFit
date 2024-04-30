import { logger } from '../../utils/logger';
import { ObjectId } from 'mongoose';
import { IExercise } from '../../interfaces/exercise.interface';
import { Exercises } from '../collections/exercise.schema';

export class ExercisesService {
    /**
     * Создать новое упражнение
     * @param exercise
     */
    async createExercise(exercise: IExercise) {
        try {
            const insertResult = await Exercises.insertOne(exercise);
            return insertResult.insertedId;
        } catch (error) {
            logger.error('ExercisesService > createExercise > ', error);
        }
    }

    async getAllByIdList(list: ObjectId[]) {
        try {
            return await Exercises.find({
                _id: {
                    $in: list,
                },
            }).toArray();
        } catch (error) {
            logger.error('ExercisesService > createExercise > ', error);
        }
    }
}

import { logger } from '../../utils/logger';
import { IExercise } from '../../interfaces/exercise.interface';
import { Exercise } from '../collections/exercise.schema';

export class ExercisesService {
    /**
     * Создать новое упражнение
     * @param exercise
     */
    async createExercise(exercise: IExercise) {
        try {
            const insertResult = new Exercise(exercise);
            await insertResult.save();
            return insertResult._id;
        } catch (error) {
            logger.error('ExercisesService > createExercise > ', error);
        }
    }

    /**
     * Получить все упражнения по списку id
     * @param list
     */
    async getAllByIdList(list: string[]) {
        try {
            return await Exercise.find({
                _id: {
                    $in: list,
                },
            }).exec();
        } catch (error) {
            logger.error('ExercisesService > getAllByIdList > ', error);
        }
    }

    /**
     * Получить упражнение по id
     * @param _id
     */
    async getOneById(_id: string) {
        try {
            return await Exercise.findById(_id);
        } catch (error) {
            logger.error('ExercisesService > getOneById > ', error);
        }
    }

    /**
     * Изменить название упражнения
     * @param _id
     * @param newName
     */
    async changeExerciseName(_id: string, newName: string) {
        try {
            return await Exercise.updateOne({ _id }, { name: newName });
        } catch (error) {
            logger.error('ExercisesService > changeExerciseName > ', error);
        }
    }
}

import { logger } from '../../utils/logger';
import { ITraining } from '../../interfaces/training.interface';
import { Training } from '../collections/training.schema';
import { Exercise } from '../collections/exercise.schema';

export class TrainingsService {
    /**
     * Создать новую тренировку
     * @param training
     */
    async createTraining(training: ITraining) {
        try {
            const insertResult = new Training(training);
            await insertResult.save();
            return insertResult;
        } catch (error) {
            logger.error('TrainingsService > createTraining > ', error);
        }
    }

    /**
     * Добавить упражнение в тренировку
     * @param trainingId
     * @param exerciseId
     */
    async addExercise(trainingId: string, exerciseId: string) {
        const result = await Training.updateOne(
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
    async getOneById(_id: string) {
        try {
            return await Training.findById(_id);
        } catch (error) {
            logger.error('TrainingsService > getOneById > ', error);
        }
    }

    /**
     * Получить тренировку по id
     * @param list
     */
    async getAllByIdList(list: string[]) {
        try {
            return await Training.find({
                _id: {
                    $in: list,
                },
            });
        } catch (error) {
            logger.error('TrainingsService > getAllByIdList > ', error);
        }
    }

    /**
     * Изменить название тренировки
     * @param _id
     * @param newName
     */
    async changeTrainingName(_id: string, newName: string) {
        try {
            return await Training.updateOne({ _id }, { name: newName });
        } catch (error) {
            logger.error('TrainingsService > changeTrainingName > ', error);
        }
    }

    /**
     * Изменить название тренировки
     * @param exerciseId
     * @param trainingId
     */
    async deleteExercise(exerciseId: string, trainingId: string) {
        try {
            const trainingModified = await Training.updateOne(
                { _id: trainingId },
                { $pull: { exercises: exerciseId } }
            );

            if (trainingModified.modifiedCount > 0) {
                const delExercise = await Exercise.deleteOne({
                    _id: exerciseId,
                });

                return delExercise.deletedCount > 0;
            }

            return false;
        } catch (error) {
            logger.error('TrainingsService > changeTrainingName > ', error);
        }
    }

    /**
     * Изменить название тренировки
     * @param trainingId
     */
    async deleteTraining(trainingId: string) {
        try {
            const training: ITraining = await this.getOneById(trainingId);

            const exerciseListToDelete: string[] = training.exercises;

            let deleteExerciseResult = true;

            if (exerciseListToDelete && exerciseListToDelete.length > 0) {
                deleteExerciseResult =
                    (
                        await Exercise.deleteMany({
                            _id: { $in: exerciseListToDelete },
                        })
                    ).deletedCount > 0;
            }

            if (deleteExerciseResult) {
                const deleteTrainingResult = await Training.deleteOne({
                    _id: trainingId,
                });
                return deleteTrainingResult.deletedCount > 0;
            }

            return false;
        } catch (error) {
            logger.error('TrainingsService > changeTrainingName > ', error);
        }
    }
}

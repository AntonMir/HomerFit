import { logger } from '../../utils/logger';
import { ExercisesRepository } from '../repositoryes/exercises.repository';
import { ObjectId } from 'mongoose';
import { IExercise } from '../../interfaces/exercise.interface';

export class ExercisesService {
    private readonly exercisesRepository: ExercisesRepository;

    constructor() {
        this.exercisesRepository = new ExercisesRepository();
    }

    /**
     * Создать новое упражнение
     * @param exercise
     */
    async createExercise(exercise: IExercise) {
        try {
            return await this.exercisesRepository.insertOne(exercise);
        } catch (error) {
            logger.error('ExercisesService > createExercise > ', error);
        }
    }

    async getAllByIdList(list: ObjectId[]) {
        try {
            return await this.exercisesRepository.getAllByIdList(list);
        } catch (error) {
            logger.error('ExercisesService > createExercise > ', error);
        }
    }
}

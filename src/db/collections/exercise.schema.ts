import mongoose from 'mongoose';
import { IExercise } from '../../interfaces/exercise.interface';

export const Exercises = mongoose.connection.collection<IExercise>('exercises');

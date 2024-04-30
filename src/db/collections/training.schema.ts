import mongoose from 'mongoose';
import { ITraining } from '../../interfaces/training.interface';

export const Trainings = mongoose.connection.collection<ITraining>('trainings');

import mongoose, { Schema, Types } from 'mongoose';
import { IApproach } from '../../interfaces/approach.interface';

const trainingsHistorySchema = new Schema({
    _id: {
        type: String,
        default: () => new Types.ObjectId(),
    },
    userTgId: Number,
    trainingId: String,
    exerciseId: String,
    date: Date,
    approachList: Array<IApproach>,
});

export const TrainingHistory = mongoose.model(
    'TrainingHistory',
    trainingsHistorySchema,
    'trainingsHistory'
);

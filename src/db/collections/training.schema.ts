import mongoose, { Schema, Types } from 'mongoose';

const trainingSchema = new Schema({
    _id: {
        type: String,
        default: () => new Types.ObjectId(),
    },
    userTgId: Number,
    name: String,
    exercises: Array<string>,
});

export const Training = mongoose.model('Training', trainingSchema, 'trainings');

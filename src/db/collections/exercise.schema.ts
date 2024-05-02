import mongoose, { Schema, Types } from 'mongoose';

const exerciseSchema = new Schema({
    _id: {
        type: String,
        default: () => new Types.ObjectId(),
    },
    trainingId: String,
    name: String,
});

export const Exercise = mongoose.model('Exercise', exerciseSchema, 'exercises');

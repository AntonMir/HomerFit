import mongoose, { Schema, Types } from 'mongoose';

const botUserSchema = new Schema({
    _id: {
        type: String,
        default: () => new Types.ObjectId(),
    },
    id: Number,
    bot: String,
    data: Object,
    createDate: Date,
});

export const BotUser = mongoose.model('BotUser', botUserSchema, 'botUsers');

import mongoose from 'mongoose';

export const BotUsers = mongoose.connection.collection<{ _id: string }>(
    'botUsers'
);
const userModel = new mongoose.Schema({
    _id: { type: String },
    id: Number,
    bot: String,
    data: Object,
    createDate: Date,
});

export const BotUser = mongoose.model('BotUser', userModel, 'botUsers', {
    connection: mongoose.connection,
});

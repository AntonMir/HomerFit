import mongoose from 'mongoose';

export const BotUsers = mongoose.connection.collection('botUsers');
const userModel = new mongoose.Schema({
    _id: String,
    id: Number,
    bot: String,
    data: Object,
    createDate: Date,
});

export const BotUser = mongoose.model('BotUser', userModel, 'botUsers', {
    connection: mongoose.connection,
});

import mongoose from 'mongoose';

export const TelegramChannels =
    mongoose.connection.collection('telegramChannels');

const chanModel = new mongoose.Schema({
    _id: String,
    title: String,
    channelId: String,
    link: String,
    geo: String
});

export const TelegramChannel = mongoose.model(
    'TelegramChannel',
    chanModel,
    'telegramChannels',
    {
        connection: mongoose.connection,
    }
);

import mongoose from 'mongoose';

export const BotsSettingsCollection = mongoose.connection.collection('botsSettings');


const botsSettingsModel = new mongoose.Schema({
    _id: String,
    projectId: String,
    stubChannelLink: String
});

export const BotsSettings = mongoose.model('BotsSettings', botsSettingsModel, 'botsSettings', {
    connection: mongoose.connection,
});
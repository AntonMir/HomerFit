import mongoose from 'mongoose';

export const BotsApiTokensCollection = mongoose.connection.collection('botsApiTokens');


const botsApiTokensModel = new mongoose.Schema({
    _id: String,
    botId: String,
    botAuthToken: String,
});

export const BotsApiTokens = mongoose.model('BotsApiTokens', botsApiTokensModel, 'botsApiTokens', {
    connection: mongoose.connection,
});
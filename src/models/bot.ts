import mongoose from 'mongoose';

export const Bots = mongoose.connection.collection('bots');

const botModel = new mongoose.Schema({
    _id: String,
    type: String,
    archive: Boolean,
    status: Boolean,
    username: String,
    locale: String,
    channel: String,
    token: String,
    createBy: String,
    createDate: Date,
    flowTracking: Boolean,
    projectId: String,
    server: String
});

export const Bot = mongoose.model('Bot', botModel, 'bots', {
    connection: mongoose.connection,
});

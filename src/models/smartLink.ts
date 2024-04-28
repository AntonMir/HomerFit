import mongoose from 'mongoose';

const linkModel = new mongoose.Schema({
    _id: String,
    buyer: String,
    bot: String,
    buyerName: String,
    botUsername: String,
    projectId: String,
});

export const SmartLink = mongoose.model('SmartLink', linkModel, 'smartLink', {
    connection: mongoose.connection,
});

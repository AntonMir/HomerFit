import mongoose from 'mongoose';

export const KeitaroPostbacks = mongoose.connection.collection('keitaroPostbacks');

// const keitaroPostbackModel = new mongoose.Schema({
//     _id: String,
//     url: String || undefined,
//     params: Object || undefined,
//     status: String || Number || undefined,
//     body: Object || undefined,
//     sendDate: Date || Number || undefined,
//     botId: String || Number || undefined
// });
//
// export const KeitaroPostback = mongoose.model('KeitaroPostback', keitaroPostbackModel, 'keitaroPostbacks', {
//     connection: mongoose.connection,
// });

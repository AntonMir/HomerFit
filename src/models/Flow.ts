import mongoose from 'mongoose';


// Flow History collection
export const FlowHistory = mongoose.connection.collection('flowHistory');
const flowModel = new mongoose.Schema({
    botId: String,
    type: String,
    userId: Number,
    from: Object || String,
    to: String,
    date: Date,
    leadSaleDate: Date,
});
export const Flow = mongoose.model('Flow', flowModel, 'flowHistory', {
    connection: mongoose.connection,
});

// Sub Flow History collection
export const FlowSubHistory = mongoose.connection.collection('flowSubHistory');
const flowSubModel = new mongoose.Schema({
    date: Date,
    chatId: Number,
    chatTitle: String,
    newStatus: String,
    userId: Number,
});
export const FlowSub = mongoose.model('FlowSub', flowSubModel, 'flowSubHistory', {
    connection: mongoose.connection,
});
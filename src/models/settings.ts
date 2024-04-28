import mongoose from 'mongoose';

let connectionString: string

if(process.env.NODE_ENV === 'production') {
    connectionString = process.env.FINANCE_MONGO_URL
} else {
    connectionString = process.env.MONGO_URL
}

// Создание нового соединения
const financeConnection = mongoose.createConnection(connectionString, {
    // @ts-ignore
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Получение коллекции из нового соединения
const Settings = financeConnection.collection('settings');

export { Settings };
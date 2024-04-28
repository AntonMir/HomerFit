import mongoose from 'mongoose';

let StorageItem;

(async () => {
    // connect to finance database
    const financeConnection = await mongoose.createConnection(
        String(process.env.FINANCE_MONGO_URL)
    );
    const storageSchema = new mongoose.Schema({
        _id: String,
        fileId: Object,
        path: String,
    });
    StorageItem = mongoose.model(
        'StorageItems',
        storageSchema,
        'storageItems',
        {
            connection: financeConnection,
        }
    );
})();

export { StorageItem };

import { ConnectOptions } from 'mongoose';
import mongoose from 'mongoose';
import { logger } from '../utils/logger';

export const creatDBConnect = async () => {
    try {
        const mongoOptions: ConnectOptions = {
            autoCreate: true,
            autoIndex: true,
        };
        await mongoose.connect(process.env.MONGO_URL, mongoOptions);
    } catch (error) {
        logger.error('creatDBConnect Error: ', error);
    }
};

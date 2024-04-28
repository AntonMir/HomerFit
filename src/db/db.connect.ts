import {ConnectOptions} from "mongoose";
import mongoose from "mongoose";

export const creatDBConnect = async () => {
    const mongoOptions: ConnectOptions = {
        autoCreate: true,
        autoIndex: true,
    };
    await mongoose.connect(process.env.MONGO_URL, mongoOptions);
}
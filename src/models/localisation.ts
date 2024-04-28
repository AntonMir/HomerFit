import mongoose from 'mongoose';
import { Localisation } from '../localisation';
import { DefaultDevLocale } from '../defaultDevLocale';

export const Localisations = mongoose.connection.collection('localisations');

const locModel = new mongoose.Schema({
    _id: String,
    name: String,
    type: String,
    createBy: String,
    createDate: Date,
    ...Object.keys(DefaultDevLocale).reduce((acc, key) => {
        acc[key] = String;
        return acc;
    }, {}),
    ...Object.keys(Localisation).reduce((acc, key) => {
        acc[key] = String;
        return acc;
    }, {}),
    videos: Object,
});

export const Localisation = mongoose.model(
    'Localisation',
    locModel,
    'localisations',
    {
        connection: mongoose.connection,
    }
);

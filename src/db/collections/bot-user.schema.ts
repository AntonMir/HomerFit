import mongoose from 'mongoose';
import { IBotUser } from '../../interfaces/bot-user.interface';

export const BotUsers = mongoose.connection.collection<IBotUser>('botUsers');

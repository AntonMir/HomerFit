import { ObjectId } from 'mongoose';
import { UserSession } from './user-session.interface';

export interface IBotUser {
    _id?: ObjectId;
    id?: number;
    bot?: string;
    data?: UserSession;
    createDate?: Date;
}

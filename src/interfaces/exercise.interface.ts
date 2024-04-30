import { ObjectId } from 'mongoose';

/**
 * ### Упражнение.
 * #### Включает в себя:
 * - <b>name: string</b> > название
 */
export interface IExercise {
    _id?: ObjectId;
    name?: string;
}

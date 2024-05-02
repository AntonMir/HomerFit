/**
 * ### Тренировка.
 * #### Включает в себя:
 * - <b>name: string</b> > название
 * - <b>userTgId: number</b> > название
 * - <b>exercises: string[]</b> > список id упражнений
 */
export interface ITraining {
    _id?: string;
    userTgId?: number;
    name?: string;
    exercises?: string[];
}

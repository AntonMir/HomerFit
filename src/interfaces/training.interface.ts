/**
 * ### Тренировка.
 * #### Включает в себя:
 * - <b>name: string</b> > название
 * - <b>exercises: IExercise[]</b> > список упражнений
 */
export interface ITraining {
    name: string;
    exercises?: IExercise[];
}

/**
 * ### Упражнение.
 * #### Включает в себя:
 * - <b>name: string</b> > название
 * - <b>approaches: IApproach[]</b> > список подходов
 */
export interface IExercise {
    name: string;
    approaches?: IApproach[];
}

/**
 * ### Подход.
 * #### Включает в себя:
 * - <b>numberOfReps: number</b> > кол-во повторений
 * - <b>weight: number</b> > вес
 */
export interface IApproach {
    numberOfReps?: number;
    weight?: number;
}

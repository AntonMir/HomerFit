import { IApproach } from './approach.interface';

/**
 * ### История тренировок
 */
export interface ITrainingHistory {
    _id?: string;
    userTgId?: number;
    trainingId?: string;
    exerciseId?: string;
    date?: Date;
    approachList?: IApproach[];
}

import { Scenes } from 'telegraf';
import { IExercise, ITraining } from './training.interface';

export interface UserSession extends Scenes.SceneSessionData {
    // CTX.FROM FIELDS
    id?: number;
    is_bot?: boolean;
    first_name?: string;
    last_name?: string;
    username?: string;
    language_code?: string;
    is_premium?: boolean;
    added_to_attachment_menu?: boolean;
    // BOT FIELDS
    lastActivity?: Date;
    messageIds?: number[];
    botName?: string;
    // USER FIELDS
    firstStart?: boolean;
    trainingsList?: ITraining[];
    trainingCandidate?: ITraining;
    exerciseCandidate?: IExercise;

    __scenes?: Scenes.SceneSessionData;
}

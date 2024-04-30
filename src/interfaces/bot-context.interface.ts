import { Context, Scenes } from 'telegraf';
import { UserSession } from './user-session.interface';
import { TrainingsService } from '../db/services/trainings.service';
import { ExercisesService } from '../db/services/exercises.service';

export interface BotContext extends Context {
    // bot: Telegraf<BotContext>;
    // loc: LocalisationObject;
    // fileId: FileIdService | DevFileIdService;
    exercises: ExercisesService;
    trainings: TrainingsService;
    session: UserSession;
    scene: Scenes.SceneContextScene<BotContext>;
}

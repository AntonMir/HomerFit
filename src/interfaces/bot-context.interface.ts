import { Context, Scenes } from 'telegraf';
import { UserSession } from './user-session.interface';
import { TrainingsService } from '../db/services/trainings.service';
import { ExercisesService } from '../db/services/exercises.service';
import { SceneStateContext } from './scene-state-context.interface';
import { TrainingsHistoryService } from '../db/services/trainings-history.service';

export interface BotContext extends Context {
    // bot: Telegraf<BotContext>;
    // loc: LocalisationObject;
    // fileId: FileIdService | DevFileIdService;
    trainingsHistory: TrainingsHistoryService;
    exercises: ExercisesService;
    trainings: TrainingsService;
    session: UserSession;
    scene: Scenes.SceneContextScene<BotContext> & SceneStateContext;
}

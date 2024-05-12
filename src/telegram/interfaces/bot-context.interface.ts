import { Context, Scenes } from 'telegraf';
import { UserSession } from './user-session.interface';
import { SceneStateContext } from './scene-state-context.interface';
import { ExercisesService } from '../../db/services/exercises.service';
import { TrainingsHistoryService } from '../../db/services/trainings-history.service';
import { TrainingsService } from '../../db/services/trainings.service';

export interface BotContext extends Context {
    trainingsHistory: TrainingsHistoryService;
    exercises: ExercisesService;
    trainings: TrainingsService;
    session: UserSession;
    scene: Scenes.SceneContextScene<BotContext> & SceneStateContext;
}

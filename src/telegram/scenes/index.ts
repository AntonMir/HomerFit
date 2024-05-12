import { Scenes, Telegraf } from 'telegraf';
import initScene from './init';
import firstEnter from './first-enter.scene';
import mainMenu from './mainMenu.scene';
import createTraining from './create/create-training.scene';
import createExercise from './create/create-exercise.scene';
import workoutTrainings from './workout/workout-trainings.scene';
import workoutExercises from './workout/workout-exercises.scene';
import workoutApproaches from './workout/workout-approaches.scene';
import editMain from './edit/edit-main.scene';
import editTraining from './edit/edit-training.scene';
import editExercise from './edit/edit-exercise.scene';
import { SCENES } from '../enums/scenes.enum';
import { BotContext } from '../interfaces/bot-context.interface';

const firstEnterScene = new Scenes.BaseScene<BotContext>(SCENES.FIRST_ENTER);
const mainMenuScene = new Scenes.BaseScene<BotContext>(SCENES.MAIN_MENU);
const createTrainingScene = new Scenes.BaseScene<BotContext>(
    SCENES.CREATE_TRAINING
);
const createExerciseScene = new Scenes.BaseScene<BotContext>(
    SCENES.CREATE_EXERCISE
);
const workoutTrainingsScene = new Scenes.BaseScene<BotContext>(
    SCENES.WORKOUT_TRAININGS
);
const workoutExercisesScene = new Scenes.BaseScene<BotContext>(
    SCENES.WORKOUT_EXERCISES
);
const workoutApproachesScene = new Scenes.BaseScene<BotContext>(
    SCENES.WORKOUT_APPROACHES
);
const editMainScene = new Scenes.BaseScene<BotContext>(SCENES.EDIT_MAIN);
const editTrainingScene = new Scenes.BaseScene<BotContext>(
    SCENES.EDIT_TRAINING
);
const editExerciseScene = new Scenes.BaseScene<BotContext>(
    SCENES.EDIT_EXERCISE
);

export default (
    bot: Telegraf<BotContext>,
    stage: Scenes.Stage<BotContext>
): void => {
    stage.scenes = new Map<string, Scenes.BaseScene<BotContext>>([
        [SCENES.FIRST_ENTER, firstEnterScene],
        [SCENES.MAIN_MENU, mainMenuScene],
        [SCENES.CREATE_TRAINING, createTrainingScene],
        [SCENES.CREATE_EXERCISE, createExerciseScene],
        [SCENES.WORKOUT_TRAININGS, workoutTrainingsScene],
        [SCENES.WORKOUT_EXERCISES, workoutExercisesScene],
        [SCENES.WORKOUT_APPROACHES, workoutApproachesScene],
        [SCENES.EDIT_MAIN, editMainScene],
        [SCENES.EDIT_TRAINING, editTrainingScene],
        [SCENES.EDIT_EXERCISE, editExerciseScene],
    ]);

    firstEnter(firstEnterScene);
    mainMenu(mainMenuScene);
    createTraining(createTrainingScene);
    createExercise(createExerciseScene);
    workoutTrainings(workoutTrainingsScene);
    workoutExercises(workoutExercisesScene);
    workoutApproaches(workoutApproachesScene);
    editMain(editMainScene);
    editTraining(editTrainingScene);
    editExercise(editExerciseScene);

    bot.use(initScene);
};

import { Scenes, Telegraf } from 'telegraf';
import initScene from './init';
import firstEnter from './first-enter.scene';
import mainMenu from './mainMenu.scene';
import createTraining from './create/create-training.scene';
import createExercise from './create/create-exercise.scene';
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

export default (
    bot: Telegraf<BotContext>,
    stage: Scenes.Stage<BotContext>
): void => {
    stage.scenes = new Map<string, Scenes.BaseScene<BotContext>>([
        [SCENES.FIRST_ENTER, firstEnterScene],
        [SCENES.MAIN_MENU, mainMenuScene],
        [SCENES.CREATE_TRAINING, createTrainingScene],
        [SCENES.CREATE_EXERCISE, createExerciseScene],
    ]);

    firstEnter(firstEnterScene);
    mainMenu(mainMenuScene);
    createTraining(createTrainingScene);
    createExercise(createExerciseScene);

    bot.use(initScene);
};

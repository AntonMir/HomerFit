import { Scenes, Telegraf } from 'telegraf';
import initScene from './init';
import start from './start.scene';
import mainMenu from './mainMenu.scene';
import createTraining from './create-training.scene';
import createExercise from './create-exercise.scene';
import { BotContext } from '../interfaces/bot-context.interface';
import { SCENES } from '../enums/scenes.enum';

const startScene = new Scenes.BaseScene<BotContext>(SCENES.START);
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
        [SCENES.START, startScene],
        [SCENES.MAIN_MENU, mainMenuScene],
        [SCENES.CREATE_TRAINING, createTrainingScene],
        [SCENES.CREATE_EXERCISE, createExerciseScene],
    ]);

    start(startScene);
    mainMenu(mainMenuScene);
    createTraining(createTrainingScene);
    createExercise(createExerciseScene);

    bot.use(initScene);
};

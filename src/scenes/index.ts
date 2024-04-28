import { Scenes, Telegraf } from 'telegraf';
import globalBot from './global';
import mainMenu from './mainMenu.scene';
import {BotContext} from "../interfaces/bot-context.interface";

const mainMenuScene = new Scenes.BaseScene<BotContext>('mainMenu');


export default (
    bot: Telegraf<BotContext>,
    stage: Scenes.Stage<BotContext>
): void => {
    stage.scenes = new Map<string, Scenes.BaseScene<BotContext>>([
        ['mainMenu', mainMenuScene],

    ]);

    mainMenu(mainMenuScene);

    bot.use(globalBot);
};

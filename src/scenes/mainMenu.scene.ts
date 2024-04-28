import { Markup, Scenes } from 'telegraf';
import { messageCleaner } from '../utils/messageCleaner';
import { MomentTimer } from '../utils/momentTimer';
import {BotContext} from "../interfaces/bot-context.interface";


export default (mainMenu: Scenes.BaseScene<BotContext>): void => {

    // 0.1
    mainMenu.enter(async (ctx: BotContext) => {
        await ctx.reply('hi')
    })
};

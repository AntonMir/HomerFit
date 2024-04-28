import { Composer } from 'telegraf';
import { BotUser } from '../models/botUser';
import {BotContext} from "../interfaces/bot-context.interface";

let globalBot = new Composer<BotContext>();

globalBot.command('start' ,async (ctx) => {
    await BotUser.updateOne(
        { id: ctx.from.id, bot: 'homer-fit' },
        { $set: { id: ctx.from.id } },
        { upsert: true },
    );

    ctx.session = {
        ...ctx.session,
        ...ctx.from,
        messageIds: [],
    }
    return await ctx.scene.enter('mainMenu');
});


export default globalBot;

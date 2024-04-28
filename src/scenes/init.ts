import { Composer } from 'telegraf';
import { BotUser } from '../models/botUser';
import { BotContext } from '../interfaces/bot-context.interface';
import { SCENES } from '../enums/scenes.enum';

const init = new Composer<BotContext>();

init.command('start', async (ctx) => {
    if (ctx.session.firstStart !== false) {
        ctx.session = {
            ...ctx.session,
            ...ctx.from,
            messageIds: [],
            trainingsList: [],
        };

        await BotUser.updateOne(
            { id: ctx.from.id },
            { $set: { id: ctx.from.id } },
            { upsert: true }
        );

        return await ctx.scene.enter(SCENES.START);
    }

    return await ctx.scene.enter(SCENES.MAIN_MENU);
});

// TODO: удалить
init.command('reset', async (ctx: BotContext) => {
    await BotUser.deleteOne({ id: ctx.from.id });
    ctx.session = {
        __scenes: {},
    };
    await ctx.reply('Successful reset. /start');
});

export default init;

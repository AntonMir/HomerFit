import { Composer } from 'telegraf';
import { SCENES } from '../enums/scenes.enum';
import { BotContext } from '../interfaces/bot-context.interface';
import { BotUsers } from '../db/collections/bot-user.schema';

const init = new Composer<BotContext>();

init.command('start', async (ctx) => {
    if (ctx.session.firstStart !== false) {
        ctx.session = {
            ...ctx.session,
            ...ctx.from,
            messageIds: [],
            trainingsList: [],
        };

        await BotUsers.updateOne(
            { id: ctx.from.id },
            { $set: { id: ctx.from.id } },
            { upsert: true }
        );

        return await ctx.scene.enter(SCENES.FIRST_ENTER);
    }

    return await ctx.scene.enter(SCENES.MAIN_MENU);
});

// TODO: удалить
init.command('reset', async (ctx: BotContext) => {
    await BotUsers.deleteOne({ id: ctx.from.id });
    ctx.session = {
        __scenes: {},
    };
    await ctx.reply('Successful reset. /start');
});

export default init;

import { Markup, Scenes } from 'telegraf';
import { BotContext } from '../interfaces/bot-context.interface';
import { SCENES } from '../enums/scenes.enum';

export default (start: Scenes.BaseScene<BotContext>): void => {
    start.enter(async (ctx: BotContext) => {
        const startText =
            `Привет ${ctx.from.first_name}\n` +
            `\n` +
            `Этот бот предназначен для создания и записи истории твоих тренировок\n` +
            `\n` +
            `⬇️️Чтобы начать жми "START"⬇️️`;

        const startKeyboard = Markup.inlineKeyboard([
            [Markup.button.callback('START', 'toMainMenu')],
        ]);

        const message = await ctx.replyWithHTML(startText, startKeyboard);

        ctx.session.messageIds.push(message.message_id);
    });

    start.action('toMainMenu', async (ctx: BotContext) => {
        ctx.session.firstStart = false;
        return await ctx.scene.enter(SCENES.MAIN_MENU);
    });
};

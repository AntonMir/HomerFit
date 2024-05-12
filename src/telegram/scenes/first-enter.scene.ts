import { Markup, Scenes } from 'telegraf';
import { SCENES } from '../enums/scenes.enum';
import { BotContext } from '../interfaces/bot-context.interface';

export default (firstEnter: Scenes.BaseScene<BotContext>): void => {
    firstEnter.enter(async (ctx: BotContext) => {
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

    firstEnter.action('toMainMenu', async (ctx: BotContext) => {
        ctx.session.firstStart = false;
        return await ctx.scene.enter(SCENES.MAIN_MENU);
    });
};

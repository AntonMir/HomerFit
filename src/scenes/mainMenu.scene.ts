import { Markup, Scenes } from 'telegraf';
import { messageCleaner } from '../utils/messageCleaner';
import { BotContext } from '../interfaces/bot-context.interface';
import { SCENES } from '../enums/scenes.enum';

export default (mainMenu: Scenes.BaseScene<BotContext>): void => {
    mainMenu.enter(async (ctx: BotContext) => {
        await messageCleaner(ctx);

        const menuText = `Главное меню`;

        const menuKeyboard = Markup.inlineKeyboard([
            [Markup.button.callback('Начать тренировку', 'startTraining')],
            [Markup.button.callback('Изменить тренировку', 'editTraining')],
            [Markup.button.callback('Создать тренировку', 'createTraining')],
        ]);

        const message = await ctx.replyWithHTML(menuText, menuKeyboard);
        ctx.session.messageIds.push(message.message_id);
    });

    mainMenu.action('createTraining', async (ctx: BotContext) => {
        return await ctx.scene.enter(SCENES.CREATE_TRAINING);
    });

    mainMenu.action('editTraining', async (ctx: BotContext) => {
        return await ctx.scene.enter(SCENES.EDIT_TRAINING);
    });

    mainMenu.action('startTraining', async (ctx: BotContext) => {
        return await ctx.scene.enter(SCENES.START_TRAINING);
    });
};

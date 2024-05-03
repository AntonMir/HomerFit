import { Markup, Scenes } from 'telegraf';
import { messageCleaner } from '../utils/messageCleaner';
import { SCENES } from '../enums/scenes.enum';
import { BotContext } from '../interfaces/bot-context.interface';

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

    mainMenu.action('startTraining', async (ctx: BotContext) => {
        return await ctx.scene.enter(SCENES.WORKOUT_TRAININGS);
    });

    mainMenu.action('editTraining', async (ctx: BotContext) => {
        return await ctx.scene.enter(SCENES.EDIT_MAIN);
    });

    mainMenu.action('createTraining', async (ctx: BotContext) => {
        return await ctx.scene.enter(SCENES.CREATE_TRAINING);
    });
};

import { Markup, Scenes } from 'telegraf';
import { messageCleaner } from '../utils/messageCleaner';
import { SCENES } from '../enums/scenes.enum';
import { BotContext } from '../interfaces/bot-context.interface';
import { sleep } from '../utils/sleep';

export default (mainMenu: Scenes.BaseScene<BotContext>): void => {
    mainMenu.enter(async (ctx: BotContext) => {
        await messageCleaner(ctx);

        const menuText = `Главное меню`;

        const menuKeyboard = Markup.inlineKeyboard([
            [Markup.button.callback('Начать тренировку', 'startTraining')],
            [Markup.button.callback('Изменить тренировку', 'onDev')],
            [Markup.button.callback('Создать тренировку', 'createTraining')],
        ]);

        const message = await ctx.replyWithHTML(menuText, menuKeyboard);
        ctx.session.messageIds.push(message.message_id);
    });

    mainMenu.action('startTraining', async (ctx: BotContext) => {
        return await ctx.scene.enter(SCENES.WORKOUT_TRAININGS);
    });

    // TODO: переход на редактирование
    mainMenu.action('editTraining', async (ctx: BotContext) => {
        return await ctx.scene.enter(SCENES.EDIT_TRAINING);
    });

    mainMenu.action('createTraining', async (ctx: BotContext) => {
        return await ctx.scene.enter(SCENES.CREATE_TRAINING);
    });

    // TODO: переход на редактирование
    mainMenu.action('onDev', async (ctx: BotContext) => {
        await messageCleaner(ctx);
        const message = await ctx.replyWithHTML('Раздел в разработке');
        ctx.session.messageIds.push(message.message_id);
        await sleep(2000);
        return await ctx.scene.enter(SCENES.MAIN_MENU);
    });
};

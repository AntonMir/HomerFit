import { Markup, Scenes } from 'telegraf';
import { messageCleaner } from '../../utils/messageCleaner';
import { SCENES } from '../../enums/scenes.enum';
import { BotContext } from '../../interfaces/bot-context.interface';
import { BotMatchContext } from '../../interfaces/bot-match-context.interface';

export default (createTraining: Scenes.BaseScene<BotContext>): void => {
    createTraining.enter(async (ctx: BotContext) => {
        await messageCleaner(ctx);

        const text = '⬇️️Введите название тренировки⬇️️';

        const message = await ctx.replyWithHTML(
            text,
            Markup.inlineKeyboard([[Markup.button.callback('Назад', 'back')]])
        );

        ctx.session.messageIds.push(message.message_id);
    });

    createTraining.hears(/.*/, async (ctx: BotMatchContext, next: any) => {
        if (['/reset'].includes(ctx.match.input)) return next();

        ctx.session.chosenTrainingId = await ctx.trainings.createTraining({
            name: ctx.match.input,
        });

        const text =
            `Тренировка: ${ctx.match.input}\n` + `\n` + 'Добавить упражнение?';

        const keyboard = Markup.inlineKeyboard([
            [Markup.button.callback('Добавить упражнение', 'addNewExercise')],
            [Markup.button.callback('Сохранить так', 'saveTraining')],
        ]);

        const message = await ctx.replyWithHTML(text, keyboard);
        ctx.session.messageIds.push(message.message_id);
    });

    createTraining.action('addNewExercise', async (ctx: BotContext) => {
        return await ctx.scene.enter(SCENES.CREATE_EXERCISE);
    });

    createTraining.action('saveTraining', async (ctx: BotContext) => {
        ctx.session.trainingsList.push(ctx.session.chosenTrainingId);
        ctx.session.chosenTrainingId = undefined;
        return await ctx.scene.enter(SCENES.MAIN_MENU);
    });

    createTraining.action('back', async (ctx: BotContext) => {
        return await ctx.scene.enter(SCENES.MAIN_MENU);
    });
};

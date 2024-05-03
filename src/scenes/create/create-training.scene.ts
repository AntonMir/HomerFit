import { Markup, Scenes } from 'telegraf';
import { messageCleaner } from '../../utils/messageCleaner';
import { SCENES } from '../../enums/scenes.enum';
import { BotContext } from '../../interfaces/bot-context.interface';
import { BotMatchContext } from '../../interfaces/bot-match-context.interface';
import { BASE_ACTIONS } from '../../constants/base-actions.constanta';
import { sleep } from '../../utils/sleep';
import { ITraining } from '../../interfaces/training.interface';

export default (createTraining: Scenes.BaseScene<BotContext>): void => {
    let training: ITraining;

    createTraining.enter(async (ctx: BotContext) => {
        await messageCleaner(ctx);

        const text = '⬇️️ Введите название тренировки ⬇️️';

        const message = await ctx.replyWithHTML(
            text,
            Markup.inlineKeyboard([[Markup.button.callback('Назад', 'back')]])
        );

        ctx.session.messageIds.push(message.message_id);

        ctx.session.hearTrainingName = true;
    });

    createTraining.hears(/.*/, async (ctx: BotMatchContext, next: any) => {
        await sleep(500);
        try {
            await ctx.deleteMessage(ctx.message.message_id);
        } catch (error) {}
        if (BASE_ACTIONS.includes(ctx.match.input)) return next();
        if (ctx.session.hearTrainingName !== true) return next();

        await messageCleaner(ctx);

        training = await ctx.trainings.createTraining({
            name: ctx.match.input,
            userTgId: ctx.from.id,
        });

        const text =
            `Тренировка: ${ctx.match.input}\n` + `\n` + 'Добавить упражнение?';

        const keyboard = Markup.inlineKeyboard([
            [Markup.button.callback('Добавить упражнение', 'addNewExercise')],
            [Markup.button.callback('Сохранить так', 'saveTraining')],
        ]);

        const message = await ctx.replyWithHTML(text, keyboard);
        ctx.session.messageIds.push(message.message_id);
        ctx.session.hearTrainingName = false;
    });

    createTraining.action('addNewExercise', async (ctx: BotContext) => {
        return await ctx.scene.enter(SCENES.CREATE_EXERCISE, {
            trainingId: training._id,
        });
    });

    createTraining.action('saveTraining', async (ctx: BotContext) => {
        ctx.session.trainingsList.push(training._id);
        return await ctx.scene.enter(SCENES.MAIN_MENU);
    });

    createTraining.action('back', async (ctx: BotContext) => {
        return await ctx.scene.enter(SCENES.MAIN_MENU);
    });
};

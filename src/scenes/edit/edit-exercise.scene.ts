import { Markup, Scenes } from 'telegraf';
import { messageCleaner } from '../../utils/messageCleaner';
import { SCENES } from '../../enums/scenes.enum';
import { BotContext } from '../../interfaces/bot-context.interface';
import { BotMatchContext } from '../../interfaces/bot-match-context.interface';
import { BASE_ACTIONS } from '../../constants/base-actions.constanta';
import { sleep } from '../../utils/sleep';
import { Message } from 'telegraf/types';
import { IExercise } from '../../interfaces/exercise.interface';

export default (editTraining: Scenes.BaseScene<BotContext>): void => {
    let exercise: IExercise;
    editTraining.enter(async (ctx: BotContext) => {
        await messageCleaner(ctx);

        exercise = await ctx.exercises.getOneById(ctx.scene.state.exerciseId);

        const text = `Выбрано упражнение: ${exercise.name}`;

        const message = await ctx.replyWithHTML(
            text,
            Markup.inlineKeyboard([
                [Markup.button.callback('Изменить название', 'changeName')],
                [
                    Markup.button.callback(
                        'Удалить упражнение из тренировки',
                        'deleteExercise'
                    ),
                ],
                [Markup.button.callback('Назад', 'toEditTraining')],
            ])
        );

        ctx.session.messageIds.push(message.message_id);
    });

    editTraining.action('changeName', async (ctx: BotContext) => {
        await messageCleaner(ctx);

        ctx.session.editExercise = true;
        const text =
            `Текущее название упражнения: ${exercise.name}\n` +
            `\n` +
            `⬇️️ Введите новое название ⬇️️`;
        const message = await ctx.replyWithHTML(
            text,
            Markup.inlineKeyboard([
                [Markup.button.callback('Назад', 'toEditExercise')],
            ])
        );
        ctx.session.messageIds.push(message.message_id);
    });

    editTraining.hears(/.*/, async (ctx: BotMatchContext, next: any) => {
        await sleep(500);
        try {
            await ctx.deleteMessage(ctx.message.message_id);
        } catch (error) {}
        if (BASE_ACTIONS.includes(ctx.match.input)) return next();
        if (ctx.session.editExercise !== true) return next();

        await messageCleaner(ctx);

        const editResult = await ctx.exercises.changeExerciseName(
            exercise._id,
            ctx.match.input
        );

        let message: Message.TextMessage;

        if (editResult.modifiedCount > 0) {
            message = await ctx.replyWithHTML('Название успешно изменено');
        } else {
            message = await ctx.replyWithHTML(
                'Что-то пошло не так, попробуйте позже'
            );
        }

        ctx.session.messageIds.push(message.message_id);
        ctx.session.editExercise = false;

        await sleep(3000);

        return await ctx.scene.enter(SCENES.EDIT_EXERCISE, {
            trainingId: ctx.scene.state.trainingId,
            exerciseId: ctx.scene.state.exerciseId,
        });
    });

    editTraining.action('toEditTraining', async (ctx: BotContext) => {
        return await ctx.scene.enter(SCENES.EDIT_TRAINING, {
            trainingId: ctx.scene.state.trainingId,
        });
    });

    editTraining.action('toEditExercise', async (ctx: BotContext) => {
        return await ctx.scene.enter(SCENES.EDIT_EXERCISE, {
            trainingId: ctx.scene.state.trainingId,
            exerciseId: ctx.scene.state.exerciseId,
        });
    });

    editTraining.action('deleteExercise', async (ctx: BotContext) => {
        await messageCleaner(ctx);

        const deleteResult = await ctx.trainings.deleteExercise(
            exercise._id,
            exercise.trainingId
        );

        let message: Message.TextMessage;

        if (deleteResult) {
            message = await ctx.replyWithHTML('Упражнение успешно удалено');
        } else {
            message = await ctx.replyWithHTML(
                'Что-то пошло не так, попробуйте позже'
            );
        }

        ctx.session.messageIds.push(message.message_id);

        await sleep(3000);

        return await ctx.scene.enter(SCENES.EDIT_TRAINING, {
            trainingId: ctx.scene.state.trainingId,
        });
    });
};

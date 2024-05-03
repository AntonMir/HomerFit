import { Markup, Scenes } from 'telegraf';
import { messageCleaner } from '../../utils/messageCleaner';
import { SCENES } from '../../enums/scenes.enum';
import { BotContext } from '../../interfaces/bot-context.interface';
import { BotMatchContext } from '../../interfaces/bot-match-context.interface';
import { BASE_ACTIONS } from '../../constants/base-actions.constanta';
import { sleep } from '../../utils/sleep';
import { Message } from 'telegraf/types';
import { ITraining } from '../../interfaces/training.interface';
import { IExercise } from '../../interfaces/exercise.interface';

const exercisesListKeyboard = async (
    ctx: BotContext,
    exercisesList: IExercise[]
) => {
    const keyboard = [];

    exercisesList.forEach((exercise) => {
        keyboard.push([
            Markup.button.callback(
                `${exercise.name}`,
                `editExercise-${exercise._id}`
            ),
        ]);
    });

    keyboard.push([Markup.button.callback(`Назад`, `toTrainings`)]);

    return Markup.inlineKeyboard(keyboard);
};

export default (editTraining: Scenes.BaseScene<BotContext>): void => {
    let training: ITraining;

    editTraining.enter(async (ctx: BotContext) => {
        await messageCleaner(ctx);

        training = await ctx.trainings.getOneById(ctx.scene.state.trainingId);

        const text = `Выбрана тренировка: ${training.name}`;

        const message = await ctx.replyWithHTML(
            text,
            Markup.inlineKeyboard([
                [Markup.button.callback('Изменить название', 'changeName')],
                [
                    Markup.button.callback(
                        'Редактировать упражнения',
                        'choseExerciseToEdit'
                    ),
                ],
                [Markup.button.callback('Назад', 'toEditMain')],
            ])
        );

        ctx.session.messageIds.push(message.message_id);
    });

    editTraining.action('changeName', async (ctx: BotContext) => {
        await messageCleaner(ctx);

        ctx.session.editTraining = true;
        const text =
            `Текущее название тренировки: ${training.name}\n` +
            `\n` +
            `⬇️️ Введите новое название ⬇️️`;
        const message = await ctx.replyWithHTML(
            text,
            Markup.inlineKeyboard([
                [Markup.button.callback('Отмена', 'stopEdit')],
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
        if (ctx.session.editTraining !== true) return next();

        await messageCleaner(ctx);

        const editResult = await ctx.trainings.changeTrainingName(
            training._id,
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
        ctx.session.editTraining = false;

        await sleep(3000);

        return await ctx.scene.enter(SCENES.EDIT_TRAINING, {
            trainingId: training._id,
        });
    });

    editTraining.action('stopEdit', async (ctx: BotContext) => {
        return await ctx.scene.enter(SCENES.EDIT_TRAINING, {
            trainingId: training._id,
        });
    });

    editTraining.action('toEditMain', async (ctx: BotContext) => {
        return await ctx.scene.enter(SCENES.EDIT_MAIN);
    });

    editTraining.action('choseExerciseToEdit', async (ctx: BotContext) => {
        const exercises = await ctx.exercises.getAllByIdList(
            training.exercises
        );

        const text =
            `Тренировка: ${training.name}\n` +
            `\n` +
            `Выберите тренировку для редактирования: `;

        const message = await ctx.replyWithHTML(
            text,
            await exercisesListKeyboard(ctx, exercises)
        );

        ctx.session.messageIds.push(message.message_id);
    });

    editTraining.action(/editExercise-.*/, async (ctx: BotMatchContext) => {
        const exerciseId = ctx.match.input.split('-')[1];

        return await ctx.scene.enter(SCENES.EDIT_EXERCISE, {
            trainingId: ctx.scene.state.trainingId,
            exerciseId,
        });
    });
};

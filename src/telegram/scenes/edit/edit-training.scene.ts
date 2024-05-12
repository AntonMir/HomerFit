import { Markup, Scenes } from 'telegraf';
import { messageCleaner } from '../../utils/messageCleaner';
import { SCENES } from '../../enums/scenes.enum';
import { BotContext } from '../../interfaces/bot-context.interface';
import { BotMatchContext } from '../../interfaces/bot-match-context.interface';
import { Message } from 'telegraf/types';
import { IExercise } from '../../../interfaces/exercise.interface';
import { ITraining } from '../../../interfaces/training.interface';
import { sleep } from '../../../utils/sleep';
import { BASE_ACTIONS } from '../../../constants/base-actions.constanta';

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

    keyboard.push([
        Markup.button.callback(`Добавить новое упражнение`, `createExercise`),
    ]);
    keyboard.push([Markup.button.callback(`Назад`, `toEditTraining`)]);

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
                [
                    Markup.button.callback(
                        'Удалить тренировку',
                        'deleteTrainingWarn'
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
        await messageCleaner(ctx);

        let text = `Тренировка: ${training.name}`;
        let message: Message.TextMessage;

        if (training.exercises && training.exercises.length > 0) {
            const exercises = await ctx.exercises.getAllByIdList(
                training.exercises
            );

            text += `\n\nВыберите упражнение для редактирования:`;

            message = await ctx.replyWithHTML(
                text,
                await exercisesListKeyboard(ctx, exercises)
            );
        } else {
            message = await ctx.replyWithHTML(
                'Вы еще не добавили ни одного приложения',
                Markup.inlineKeyboard([
                    [
                        Markup.button.callback(
                            `Добавить упражнение`,
                            `createExercise`
                        ),
                    ],
                    [Markup.button.callback(`Главное меню`, `toMainMenu`)],
                ])
            );
        }

        ctx.session.messageIds.push(message.message_id);
    });

    editTraining.action(/editExercise-.*/, async (ctx: BotMatchContext) => {
        const exerciseId = ctx.match.input.split('-')[1];

        return await ctx.scene.enter(SCENES.EDIT_EXERCISE, {
            trainingId: ctx.scene.state.trainingId,
            exerciseId,
        });
    });

    editTraining.action('deleteTrainingWarn', async (ctx: BotContext) => {
        await messageCleaner(ctx);

        const message = await ctx.replyWithHTML(
            '⚠️ Удаление тренировки приведет к потере истории! ⚠️',
            Markup.inlineKeyboard([
                [Markup.button.callback('Да, удалить', 'deleteTraining')],
                [Markup.button.callback('Назад', 'toEditTraining')],
            ])
        );

        ctx.session.messageIds.push(message.message_id);
    });

    editTraining.action('deleteTraining', async (ctx: BotContext) => {
        await messageCleaner(ctx);

        const deleteTraining = await ctx.trainings.deleteTraining(
            ctx.scene.state.trainingId
        );

        const trainingIdIndex = ctx.session.trainingsList.indexOf(
            ctx.scene.state.trainingId
        );

        if (trainingIdIndex !== -1) {
            ctx.session.trainingsList.splice(trainingIdIndex);
        }

        let message: Message.TextMessage;

        if (deleteTraining) {
            message = await ctx.replyWithHTML('Тренировка успешно удалена');
        } else {
            message = await ctx.replyWithHTML(
                'Что-то пошло не так, попробуйте позже'
            );
        }

        ctx.session.messageIds.push(message.message_id);

        await sleep(3000);

        return await ctx.scene.enter(SCENES.MAIN_MENU);
    });

    editTraining.action('toEditTraining', async (ctx: BotContext) => {
        return await ctx.scene.enter(SCENES.EDIT_TRAINING, {
            trainingId: ctx.scene.state.trainingId,
        });
    });

    editTraining.action('createExercise', async (ctx: BotContext) => {
        return await ctx.scene.enter(SCENES.CREATE_EXERCISE, {
            trainingId: ctx.scene.state.trainingId,
        });
    });

    editTraining.action('toMainMenu', async (ctx: BotContext) => {
        return await ctx.scene.enter(SCENES.MAIN_MENU);
    });
};

import { Markup, Scenes } from 'telegraf';
import { BotContext } from '../../interfaces/bot-context.interface';
import { messageCleaner } from '../../utils/messageCleaner';
import { SCENES } from '../../enums/scenes.enum';
import { BotMatchContext } from '../../interfaces/bot-match-context.interface';
import { IApproach } from '../../../interfaces/approach.interface';
import { ITrainingHistory } from '../../../interfaces/training-history.interface';
import { sleep } from '../../../utils/sleep';
import { logger } from '../../../utils/logger';
import { BASE_ACTIONS } from '../../../constants/base-actions.constanta';

export default (workoutApproaches: Scenes.BaseScene<BotContext>): void => {
    let approachList: IApproach[] = [];
    let approach: IApproach = {};
    let trainingHistoryCandidate: ITrainingHistory;
    let trainingName: string;
    let exerciseName: string;

    workoutApproaches.enter(async (ctx: BotContext) => {
        await messageCleaner(ctx);

        const { trainingId, exerciseId } = ctx.scene.state;

        const training = await ctx.trainings.getOneById(trainingId);
        const exercise = await ctx.exercises.getOneById(exerciseId);

        trainingName = training.name;
        exerciseName = exercise.name;

        trainingHistoryCandidate = {
            trainingId,
            exerciseId,
            date: new Date(),
            userTgId: ctx.from.id,
        };

        const text =
            `Тренировка: ${trainingName}\n` +
            `Упражнение: ${exerciseName}\n` +
            `Подход: ${approachList.length + 1}\n` +
            `\n` +
            `⬇️️ Введите вес ⬇️️`;

        const message = await ctx.replyWithHTML(
            text,
            Markup.inlineKeyboard([
                [Markup.button.callback('Свой вес', 'choseMyWeight')],
            ])
        );
        ctx.session.messageIds.push(message.message_id);
    });

    workoutApproaches.action('choseMyWeight', async (ctx: BotContext) => {
        await messageCleaner(ctx);

        approach.weight = 'Свой вес';

        const text =
            `Тренировка: ${trainingName}\n` +
            `Упражнение: ${exerciseName}\n` +
            `Подход: ${approachList.length + 1}\n` +
            `Вес: ${approach.weight}\n` +
            `\n` +
            `⬇️️ Введите кол-во повторений ⬇️️`;

        const message = await ctx.replyWithHTML(text);
        ctx.session.messageIds.push(message.message_id);
    });

    workoutApproaches.hears(/.*/, async (ctx: BotMatchContext, next: any) => {
        await sleep(500);
        try {
            await ctx.deleteMessage(ctx.message.message_id);
        } catch (error) {
            logger.error(
                `Create exercise scene > hears(/.*/) > deleteMessage > ${error}`
            );
        }
        if (BASE_ACTIONS.includes(ctx.match.input)) return next();

        await messageCleaner(ctx);

        approach.approachNumber = approachList.length + 1;

        // Указываем вес упражнения
        if (!approach.weight) {
            approach.weight = ctx.match.input;

            const text =
                `Тренировка: ${trainingName}\n` +
                `Упражнение: ${exerciseName}\n` +
                `Подход: ${approachList.length + 1}\n` +
                `Вес: ${approach.weight}\n` +
                `\n` +
                `⬇️️ Введите кол-во повторений ⬇️️`;

            const message = await ctx.replyWithHTML(text);
            ctx.session.messageIds.push(message.message_id);

            return;
        }

        // Указываем кол-во повторений
        if (!approach.numberOfReps) {
            approach.numberOfReps = +ctx.match.input;

            const text =
                `Тренировка: ${trainingName}\n` +
                `Упражнение: ${exerciseName}\n` +
                `Подход: ${approachList.length + 1}\n` +
                `Вес: ${approach.weight}\n` +
                `Повторений: ${approach.numberOfReps}`;

            const message = await ctx.replyWithHTML(
                text,
                Markup.inlineKeyboard([
                    [
                        Markup.button.callback(
                            'Следующий подход',
                            'nextApproach'
                        ),
                    ],
                    [
                        Markup.button.callback(
                            'Закончить выполнение',
                            'stopExercise'
                        ),
                    ],
                ])
            );
            ctx.session.messageIds.push(message.message_id);
            approachList.push(approach);

            return;
        }

        return next();
    });

    // Следующий подход
    workoutApproaches.action('nextApproach', async (ctx: BotContext) => {
        await messageCleaner(ctx);

        approach = {};

        const text =
            `Тренировка: ${trainingName}\n` +
            `Упражнение: ${exerciseName}\n` +
            `Подход: ${approachList.length + 1}\n` +
            `\n` +
            `⬇️️ Введите вес ⬇️️`;

        const message = await ctx.replyWithHTML(
            text,
            Markup.inlineKeyboard([
                [Markup.button.callback('Свой вес', 'choseMyWeight')],
            ])
        );
        ctx.session.messageIds.push(message.message_id);
    });

    // Закончить упражнение
    workoutApproaches.action('stopExercise', async (ctx: BotContext) => {
        await messageCleaner(ctx);

        let isError = false;

        if (approachList && approachList.length > 0) {
            approachList.forEach((approach) => {
                if (
                    !approach.weight ||
                    !approach.approachNumber ||
                    !approach.numberOfReps
                ) {
                    isError = true;
                }
            });
        } else {
            isError = true;
        }

        if (isError) {
            const message = await ctx.replyWithHTML(
                'Что-то пошло не так, тренировка не сохранена'
            );

            ctx.session.messageIds.push(message.message_id);

            await sleep(3000);

            return await ctx.scene.enter(SCENES.MAIN_MENU);
        }

        let text =
            `Тренировка: ${trainingName}\n` +
            `Упражнение: ${exerciseName}\n` +
            `\n` +
            `РЕЗУЛЬТАТ:\n` +
            `Подход - Повторения - Вес\n`;

        approachList.map((approach) => {
            text += `${approach.approachNumber} - ${approach.numberOfReps} - ${approach.weight}(кг)\n`;
        });

        trainingHistoryCandidate.approachList = approachList;

        const message = await ctx.replyWithHTML(
            text,
            Markup.inlineKeyboard([
                [Markup.button.callback('К списку упражнений', 'toExercises')],
            ])
        );
        ctx.session.messageIds.push(message.message_id);

        await ctx.trainingsHistory.create(trainingHistoryCandidate);
    });

    // К выбору упражнений
    workoutApproaches.action('toExercises', async (ctx: BotContext) => {
        await ctx.scene.enter(SCENES.WORKOUT_EXERCISES, {
            trainingId: ctx.scene.state.trainingId,
        });
    });

    workoutApproaches.leave(() => {
        approach = {};
        approachList = [];
        trainingHistoryCandidate = {};
        trainingName = '';
        exerciseName = '';
    });
};

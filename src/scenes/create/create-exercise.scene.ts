import { Markup, Scenes } from 'telegraf';
import { messageCleaner } from '../../utils/messageCleaner';
import { SCENES } from '../../enums/scenes.enum';
import { BotContext } from '../../interfaces/bot-context.interface';
import { BotMatchContext } from '../../interfaces/bot-match-context.interface';
import { BASE_ACTIONS } from '../../constants/base-actions.constanta';
import { sleep } from '../../utils/sleep';
import { logger } from '../../utils/logger';

const trainingCandidateMenuReply = async (ctx: BotContext) => {
    await messageCleaner(ctx);

    // берем тренировку по id (тут нам нужен список упражнений и название тренировки)
    const training = await ctx.trainings.getOneById(
        ctx.session.chosenTrainingId
    );

    let text = `Тренировка: ${training.name}\n`;

    if (training.exercises && training.exercises.length > 0) {
        // берем все упражнения в тренировке
        const exercises = await ctx.exercises.getAllByIdList(
            training.exercises
        );

        let textExercisesList: string;

        exercises.forEach((exercise) => {
            if (textExercisesList) {
                textExercisesList += ` - ${exercise.name}\n`;
            } else {
                textExercisesList = ` - ${exercise.name}\n`;
            }
        });

        text += `Упражнения:\n` + textExercisesList;
    }

    const keyboard = Markup.inlineKeyboard([
        [Markup.button.callback('Добавить упражнение', 'addOneMoreExercise')],
        [Markup.button.callback('Сохранить тренировку', 'saveTraining')],
    ]);

    const message = await ctx.replyWithHTML(text, keyboard);
    ctx.session.messageIds.push(message.message_id);
};

export default (createExercise: Scenes.BaseScene<BotContext>): void => {
    createExercise.enter(async (ctx: BotContext) => {
        await messageCleaner(ctx);

        const text = '⬇️️ Введите название упражнения ⬇️️';

        const message = await ctx.replyWithHTML(
            text,
            Markup.inlineKeyboard([[Markup.button.callback('Назад', 'back')]])
        );

        ctx.session.messageIds.push(message.message_id);
    });

    createExercise.hears(/.*/, async (ctx: BotMatchContext, next: any) => {
        await sleep(500);
        try {
            await ctx.deleteMessage(ctx.message.message_id);
        } catch (error) {
            logger.error(
                `Create exercise scene > hears(/.*/) > deleteMessage > ${error}`
            );
        }
        if (BASE_ACTIONS.includes(ctx.match.input)) return next();
        if (ctx.session.hearExerciseName !== true) return next();

        // Создаем упражнение
        const newExerciseId = await ctx.exercises.createExercise({
            name: ctx.match.input,
            trainingId: ctx.session.chosenTrainingId,
        });

        // Добавляем упражнение в тренировку
        await ctx.trainings.addExercise(
            ctx.session.chosenTrainingId,
            newExerciseId
        );

        ctx.session.hearExerciseName = false;

        return await trainingCandidateMenuReply(ctx);
    });

    createExercise.action('addOneMoreExercise', async (ctx: BotContext) => {
        ctx.session.hearExerciseName = true;
        return await ctx.scene.enter(SCENES.CREATE_EXERCISE);
    });

    createExercise.action('saveTraining', async (ctx: BotContext) => {
        ctx.session.trainingsList.push(ctx.session.chosenTrainingId);
        ctx.session.chosenTrainingId = undefined;
        return await ctx.scene.enter(SCENES.MAIN_MENU);
    });

    createExercise.action('back', async (ctx: BotContext) => {
        return await trainingCandidateMenuReply(ctx);
    });
};

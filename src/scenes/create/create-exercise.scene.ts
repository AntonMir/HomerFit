import { Markup, Scenes } from 'telegraf';
import { messageCleaner } from '../../utils/messageCleaner';
import { SCENES } from '../../enums/scenes.enum';
import { BotContext } from '../../interfaces/bot-context.interface';
import { BotMatchContext } from '../../interfaces/bot-match-context.interface';

export default (createExercise: Scenes.BaseScene<BotContext>): void => {
    createExercise.enter(async (ctx: BotContext) => {
        await messageCleaner(ctx);

        const text = '⬇️️Введите название упражнения⬇️️';

        const message = await ctx.replyWithHTML(
            text,
            Markup.inlineKeyboard([[Markup.button.callback('Назад', 'back')]])
        );

        ctx.session.messageIds.push(message.message_id);
    });

    createExercise.hears(/.*/, async (ctx: BotMatchContext, next: any) => {
        if (['/reset'].includes(ctx.match.input)) return next();

        const newExerciseId = await ctx.exercises.createExercise({
            name: ctx.match.input,
        });

        await ctx.trainings.addExercise(
            ctx.session.chosenTrainingId,
            newExerciseId
        );

        const training = await ctx.trainings.getOneById(
            ctx.session.chosenTrainingId
        );

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

        const text =
            `Тренировка: ${training.name}\n` +
            `Упражнения:\n` +
            textExercisesList;

        const keyboard = Markup.inlineKeyboard([
            [
                Markup.button.callback(
                    'Добавить упражнение',
                    'addOneMoreExercise'
                ),
            ],
            [Markup.button.callback('Сохранить тренировку', 'saveTraining')],
        ]);

        const message = await ctx.replyWithHTML(text, keyboard);
        ctx.session.messageIds.push(message.message_id);
    });

    createExercise.action('addOneMoreExercise', async (ctx: BotContext) => {
        return await ctx.scene.enter(SCENES.CREATE_EXERCISE);
    });

    createExercise.action('saveTraining', async (ctx: BotContext) => {
        ctx.session.trainingsList.push(ctx.session.chosenTrainingId);
        ctx.session.chosenTrainingId = undefined;
        return await ctx.scene.enter(SCENES.MAIN_MENU);
    });

    createExercise.action('back', async (ctx: BotContext) => {
        return await ctx.scene.enter(SCENES.CREATE_TRAINING);
    });
};

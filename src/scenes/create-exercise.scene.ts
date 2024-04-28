import { Markup, Scenes } from 'telegraf';
import { messageCleaner } from '../utils/messageCleaner';
import { BotContext } from '../interfaces/bot-context.interface';
import { SCENES } from '../enums/scenes.enum';
import { BotMatchContext } from '../interfaces/bot-match-context.interface';

export default (createExercise: Scenes.BaseScene<BotContext>): void => {
    createExercise.enter(async (ctx: BotContext) => {
        await messageCleaner(ctx);

        ctx.session.exerciseCandidate = {
            name: '',
            approaches: [],
        };

        const text = '⬇️️Введите название упражнения⬇️️';

        const message = await ctx.replyWithHTML(
            text,
            Markup.inlineKeyboard([[Markup.button.callback('Назад', 'back')]])
        );

        ctx.session.messageIds.push(message.message_id);
    });

    createExercise.hears(/.*/, async (ctx: BotMatchContext) => {
        ctx.session.exerciseCandidate.name = ctx.match.input;

        ctx.session.trainingCandidate.exercises.push(
            ctx.session.exerciseCandidate
        );

        let textExercisesList: string;

        ctx.session.trainingCandidate.exercises.forEach((exercise) => {
            if (textExercisesList) {
                textExercisesList += ` - ${exercise.name}\n`;
            } else {
                textExercisesList = ` - ${exercise.name}\n`;
            }
        });

        const text =
            `Тренировка: ${ctx.session.trainingCandidate.name}\n` +
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
        ctx.session.trainingsList.push(ctx.session.trainingCandidate);
        ctx.session.trainingCandidate = {
            name: '',
            exercises: [],
        };
        ctx.session.exerciseCandidate = {
            name: '',
            approaches: [],
        };
        return await ctx.scene.enter(SCENES.MAIN_MENU);
    });

    createExercise.action('back', async (ctx: BotContext) => {
        return await ctx.scene.enter(SCENES.CREATE_TRAINING);
    });
};

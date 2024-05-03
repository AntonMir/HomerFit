import { Markup, Scenes } from 'telegraf';
import { BotContext } from '../../interfaces/bot-context.interface';
import { messageCleaner } from '../../utils/messageCleaner';
import { SCENES } from '../../enums/scenes.enum';
import { BotMatchContext } from '../../interfaces/bot-match-context.interface';
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
                `exercise-${exercise._id}`
            ),
        ]);
    });

    keyboard.push([Markup.button.callback(`Назад`, `toTrainings`)]);

    return Markup.inlineKeyboard(keyboard);
};

export default (workoutExercises: Scenes.BaseScene<BotContext>): void => {
    workoutExercises.enter(async (ctx: BotContext) => {
        await messageCleaner(ctx);

        const { trainingId } = ctx.scene.state;

        const training: ITraining = await ctx.trainings.getOneById(trainingId);

        const exercisesList: IExercise[] = await ctx.exercises.getAllByIdList(
            training.exercises
        );

        let message: Message.TextMessage;

        if (training.exercises && training.exercises.length > 0) {
            const text =
                `Тренировка: ${training.name}\n` +
                `\n` +
                `Чтобы начать, выберите упражнение:`;
            message = await ctx.replyWithHTML(
                text,
                await exercisesListKeyboard(ctx, exercisesList)
            );
        } else {
            message = await ctx.replyWithHTML(
                'Тренировка не содержит упражнений',
                Markup.inlineKeyboard([
                    [
                        Markup.button.callback(
                            `Добавить упражнение`,
                            `editExerciseList`
                        ),
                    ],
                    [Markup.button.callback(`Назад`, `toTrainings`)],
                ])
            );
        }

        ctx.session.messageIds.push(message.message_id);
    });

    workoutExercises.action('toTrainings', async (ctx: BotContext) => {
        return await ctx.scene.enter(SCENES.WORKOUT_TRAININGS);
    });

    workoutExercises.action(/exercise-.*/, async (ctx: BotMatchContext) => {
        const exerciseId = ctx.match.input.split('-')[1];

        return await ctx.scene.enter(SCENES.WORKOUT_APPROACHES, {
            trainingId: ctx.scene.state.trainingId,
            exerciseId,
        });
    });

    workoutExercises.action('editExerciseList', async (ctx: BotContext) => {
        return await ctx.scene.enter(SCENES.CREATE_EXERCISE, {
            trainingId: ctx.scene.state.trainingId,
        });
    });
};

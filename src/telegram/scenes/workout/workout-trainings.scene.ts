import { Markup, Scenes } from 'telegraf';
import { BotContext } from '../../interfaces/bot-context.interface';
import { messageCleaner } from '../../utils/messageCleaner';
import { SCENES } from '../../enums/scenes.enum';
import { BotMatchContext } from '../../interfaces/bot-match-context.interface';
import { Message } from 'telegraf/types';

const trainingsListKeyboard = async (ctx: BotContext) => {
    const trainingsList = await ctx.trainings.getAllByIdList(
        ctx.session.trainingsList
    );

    const keyboard = [];

    trainingsList.forEach((training) => {
        keyboard.push([
            Markup.button.callback(
                `${training.name}`,
                `training-${training._id}`
            ),
        ]);
    });

    keyboard.push([Markup.button.callback(`Главное меню`, `toMainMenu`)]);

    return Markup.inlineKeyboard(keyboard);
};

export default (workoutTrainings: Scenes.BaseScene<BotContext>): void => {
    workoutTrainings.enter(async (ctx: BotContext) => {
        await messageCleaner(ctx);

        let message: Message.TextMessage;

        if (ctx.session.trainingsList && ctx.session.trainingsList.length > 0) {
            message = await ctx.replyWithHTML(
                `Выберите тренировку:`,
                await trainingsListKeyboard(ctx)
            );
        } else {
            message = await ctx.replyWithHTML(
                'Вы еще не добавили ни одну тренировку',
                Markup.inlineKeyboard([
                    [
                        Markup.button.callback(
                            `Создать тренировку`,
                            `createTraining`
                        ),
                    ],
                    [Markup.button.callback(`Главное меню`, `toMainMenu`)],
                ])
            );
        }

        ctx.session.messageIds.push(message.message_id);
    });

    workoutTrainings.action('toMainMenu', async (ctx: BotContext) => {
        return await ctx.scene.enter(SCENES.MAIN_MENU);
    });

    workoutTrainings.action(/training-.*/, async (ctx: BotMatchContext) => {
        const trainingId = ctx.match.input.split('-')[1];

        return await ctx.scene.enter(SCENES.WORKOUT_EXERCISES, {
            trainingId,
        });
    });

    workoutTrainings.action('createTraining', async (ctx: BotContext) => {
        return await ctx.scene.enter(SCENES.CREATE_TRAINING);
    });
};

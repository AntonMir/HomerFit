import { Scenes, Telegraf } from 'telegraf';
import * as rateLimit from 'telegraf-ratelimit';
import { LocalisationObject } from './utils/localisation';
import { FileIdService } from './utils/fileId';
import { logger } from './logger';
import handlers from './scenes';
import { session } from './utils/session';
import { BotContext } from './interfaces/bot-context.interface';

export const startBot = async (): Promise<void> => {
    const bot = new Telegraf<BotContext>(process.env.TELEGRAM__BOT_TOKEN);

    // ignore chats and channels
    bot.use(async (ctx, next) => {
        if (!ctx.from) return;
        if (!ctx.chat) return;
        if (ctx.chat.type !== 'private') return;
        await next();
    });

    // Rate limit
    bot.use(
        // @ts-ignore commonjs module
        rateLimit({
            window: 3000,
            limit: 2,
            onLimitExceeded: () => {
                /* Just ignore him */
                return null;
            },
        })
    );

    // Session
    bot.use(session());

    // Localisation
    bot.context.loc = new LocalisationObject();

    // FileId service
    bot.context.fileId = new FileIdService();

    // Configure stage
    const stage = new Scenes.Stage<BotContext>();
    bot.use(stage.middleware());

    bot.catch((err) => {
        console.error(err);
    });

    // Handlers
    try {
        handlers(bot, stage);
    } catch (error) {
        logger.error(error);
    }

    await bot.launch();
};

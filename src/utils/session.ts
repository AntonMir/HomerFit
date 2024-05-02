import { BotContext } from '../interfaces/bot-context.interface';
import { BotUser } from '../db/collections/bot-user.schema';

type KeyType = {
    id: number;
    bot: string;
};

const getSessionKey = (ctx: BotContext): KeyType | null => {
    if (ctx.from == null) {
        return null;
    }
    return { id: ctx.from.id, bot: ctx.botInfo.username };
};

/**
 * Session middleware with native meteor mongodb connection
 */
export const session = () => {
    const saveSession = async (key: KeyType, data: any): Promise<void> => {
        await BotUser.updateOne(
            { id: key.id, bot: key.bot },
            { $set: { data } },
            { upsert: true }
        );
    };

    const getSession = async (key: KeyType): Promise<any> => {
        return (
            (await BotUser.findOne({ id: key.id, bot: key.bot }))?.data ?? {}
        );
    };

    return async (ctx: BotContext, next: any) => {
        const key = getSessionKey(ctx);
        ctx.session = key == null ? undefined : await getSession(key);

        await next();

        if (ctx.session != null) {
            await saveSession(key, ctx.session);
        }
    };
};

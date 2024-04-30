import { BotContext } from '../interfaces/bot-context.interface';
import { BotUsers } from '../db/collections/bot-user.schema';

const getSessionKey = (ctx: BotContext) => {
    if (ctx.from == null) {
        return null;
    }

    return ctx.from.id;
};

/**
 * Session middleware with native meteor mongodb connection
 */
export const session = () => {
    const saveSession = async (tgId: number, data: any): Promise<void> => {
        await BotUsers.updateOne(
            { id: tgId },
            { $set: { data } },
            { upsert: true }
        );
    };

    const getSession = async (tgId: number): Promise<any> => {
        return (await BotUsers.findOne({ id: tgId }))?.data ?? {};
    };

    return async (ctx: BotContext, next: any) => {
        const key = getSessionKey(ctx);
        ctx.session = key == null ? undefined : await getSession(ctx.from.id);

        await next();

        if (ctx.session != null) {
            await saveSession(key, ctx.session);
        }
    };
};

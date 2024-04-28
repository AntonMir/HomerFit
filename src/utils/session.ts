import {BotContext} from "../interfaces/bot-context.interface";
import {BotUser} from "../models/botUser";

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
    const collection = BotUser;

    const saveSession = async (
        tgId: number,
        data: any
    ): Promise<void> => {
        await collection.updateOne({id: tgId}, { $set: { data } }, { upsert: true });
    };

    const getSession = async (tgId: number): Promise<any> => {
        return (await collection.findOne({id: tgId}))?.data ?? {};
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

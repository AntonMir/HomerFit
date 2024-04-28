import {BotContext} from "../interfaces/bot-context.interface";

export const messageCleaner = async (ctx: BotContext) => {
    ctx.session.messageIds.map(async (message: number) => {
        try {
            await ctx.deleteMessage(message)
        } catch(e) {}
    })
    ctx.session.messageIds = []
}
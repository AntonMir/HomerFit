import { BotContext } from '../context';

export const messageCleaner = async (ctx: BotContext) => {
    console.log(`ctx.session.messageIds`, ctx.session.messageIds)
    ctx.session.messageIds.map(async (message: number) => {
        try {
            await ctx.deleteMessage(message)
        } catch(e) {}
    })
    ctx.session.messageIds = []
}
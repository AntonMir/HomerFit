import {Context, Scenes, Telegraf} from "telegraf";
import {ChannelObject} from "../utils/channel";
import {FileIdService} from "../utils/fileId";
import {DevFileIdService} from "../utils/fileId";
import {LocalisationObject} from "../utils/localisation";
import {UserSession} from "./user-session.interface";

export interface BotContext extends Context {
    channel: ChannelObject;
    fileId: FileIdService | DevFileIdService;
    flow: (ctx: BotContext, newState: string) => Promise<void>;
    loc: LocalisationObject;
    session: UserSession;
    scene: Scenes.SceneContextScene<BotContext>;
    bot: Telegraf<BotContext>
}
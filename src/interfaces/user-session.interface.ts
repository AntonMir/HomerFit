import {Scenes} from "telegraf";

export interface UserSession extends Scenes.SceneSessionData {
    // CTX.FROM FIELDS
    id?: number
    is_bot?: boolean
    first_name?: string
    last_name?: string
    username?: string
    language_code?: string
    is_premium?: boolean
    added_to_attachment_menu?: boolean
    // BOT FIELDS
    lastActivity?: Date
    messageIds?: number[]

    __scenes?: Scenes.SceneSessionData
}
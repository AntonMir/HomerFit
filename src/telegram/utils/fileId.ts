import { Message } from 'telegraf/types';

export class FileIdService {
    private readonly storage: Record<string, any>;

    constructor() {
        this.storage = {};
    }

    async getFileId(fileId: string) {
        if (this.storage[fileId]) return this.storage[fileId];
        return {
            source: process.cwd() + '/src/assets/' + fileId,
        };
    }

    async callbackFunction(
        sentMessage: Message.VideoMessage | Message.PhotoMessage,
        fileId: string,
    ) {
        const typeOf = 'video' || 'image'
        this.storage[fileId] = sentMessage[typeOf].file_id;
    }
}

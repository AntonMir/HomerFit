import { config } from 'dotenv';
config();
import { creatDBConnect } from './db/db.connect';
import { startBot } from './bot';

(async () => {
    // init connect to MONGO
    await creatDBConnect();

    // start bot
    await startBot();
})();

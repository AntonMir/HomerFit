import { config } from 'dotenv';
config();
import * as express from 'express';
import { creatDBConnect } from './db/db.module';
import { startBot } from './telegram/bot';
import * as cors from 'cors';
import routes from './app/routes';
import expressLogger from './utils/express-logger';

const app = express();

const PORT = process.env.PORT || 3000;

app.use(cors());

app.use(express.json());

app.use(expressLogger);

app.use('/api', routes);

(async () => {
    // 1) init connect to MONGO
    await creatDBConnect();

    // 2) start Express server
    app.listen(PORT, () => {
        console.log(`Сервер запущен на порту ${PORT}`);
    });

    // 3) start bot
    await startBot();
})();

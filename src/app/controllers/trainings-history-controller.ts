import { TrainingsHistoryService } from '../../db/services/trainings-history.service';
import { Request, Response } from 'express';

/**
 * GET /api/trainings/history
 */

class TrainingsHistoryController {
    /**
     *  Получить всю историю
     */
    async getAllHistory(req: Request, res: Response) {
        try {
            const { page = 1, limit = 10, telegram_id = null } = req.query;

            if (!telegram_id) {
                return res.status(400).send({
                    message: null,
                    error: 'Отсутствует telegram_id',
                });
            }
            const trainingsHistoryService = new TrainingsHistoryService();

            const history = await trainingsHistoryService.getAllByTelegramId(
                +telegram_id,
                +page,
                +limit
            );

            if (history.data.length <= 0) {
                return res.status(404).send({
                    message: null,
                    error: 'История тренировок пуста',
                });
            }

            return res.status(200).send({
                message: history,
                error: null,
            });
        } catch (error) {
            console.error(
                'TrainingsHistoryController > getAllHistory: ',
                error
            );
            res.status(500).send({
                message: null,
                error: `Внутренняя ошибка сервера: ${error}`,
            });
        }
    }

    /**
     *  Получить историю отдельной тренировки
     */
    async getTrainingHistory(req: Request, res: Response) {
        try {
            const { training_id } = req.params;

            if (!training_id) {
                return res.status(400).send({
                    message: null,
                    error: 'Отсутствует training_id',
                });
            }
            const trainingsHistoryService = new TrainingsHistoryService();

            const history = await trainingsHistoryService.getAllByTrainingId(
                String(training_id)
            );

            if (history.data.length <= 0) {
                return res.status(404).send({
                    message: null,
                    error: 'История тренировки пуста',
                });
            }

            return res.status(200).send({
                message: history,
                error: null,
            });
        } catch (error) {
            console.error(
                'TrainingsHistoryController > getTrainingHistory: ',
                error
            );
            res.status(500).send({
                message: null,
                error: `Внутренняя ошибка сервера: ${error}`,
            });
        }
    }
}

// экспортируем новый экземпляр класса
export default new TrainingsHistoryController();

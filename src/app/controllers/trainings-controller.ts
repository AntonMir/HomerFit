import { Request, Response } from 'express';
import { TrainingsService } from '../../db/services/trainings.service';

/**
 * GET /api/trainings/history
 */

class TrainingsController {
    /**
     *  Получить всю историю
     */
    async getAllUsersTrainings(req: Request, res: Response) {
        try {
            const { page = 1, limit = 10, telegram_id = null } = req.query;

            if (!telegram_id) {
                return res.status(400).send({
                    message: null,
                    error: 'Отсутствует telegram_id',
                });
            }
            const trainingsService = new TrainingsService();

            const trainings = await trainingsService.getAllUsersTrainings(
                +telegram_id,
                +page,
                +limit
            );

            if (trainings.data.length <= 0) {
                return res.status(404).send({
                    message: null,
                    error: 'Тренировки отсутствуют',
                });
            }

            return res.status(200).send({
                message: trainings,
                error: null,
            });
        } catch (error) {
            console.error(
                'TrainingsController > getAllUsersTrainings: ',
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
export default new TrainingsController();

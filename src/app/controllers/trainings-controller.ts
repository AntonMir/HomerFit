import { Request, Response } from 'express';
import { TrainingsService } from '../../db/services/trainings.service';
import { TrainingsHistoryService } from '../../db/services/trainings-history.service';

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

    /**
     *  Получить список упражнений тренировки
     */
    async getTrainingExercises(req: Request, res: Response) {
        try {
            const { training_id } = req.params;

            if (!training_id) {
                return res.status(400).send({
                    message: null,
                    error: 'Отсутствует training_id',
                });
            }
            const trainingsService = new TrainingsService();

            const exercises = await trainingsService.getExercisesByTrainingId(
                String(training_id)
            );

            console.log(`exercises`, exercises);

            if (exercises.length <= 0) {
                return res.status(404).send({
                    message: null,
                    error: 'В тренировке отсутствуют упражнения',
                });
            }

            return res.status(200).send({
                message: exercises,
                error: null,
            });
        } catch (error) {
            console.error(
                'TrainingsHistoryController > getTrainingExercises: ',
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

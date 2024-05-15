import { logger } from '../../utils/logger';
import { ITrainingHistory } from '../../interfaces/training-history.interface';
import { TrainingHistory } from '../collections/trainings-history.schema';

export class TrainingsHistoryService {
    /**
     * Сохранить тренировку в историю
     * @param training
     */
    async create(training: ITrainingHistory) {
        try {
            const insertResult = new TrainingHistory(training);
            await insertResult.save();
            return insertResult._id;
        } catch (error) {
            logger.error('TrainingsService > createTraining > ', error);
        }
    }

    /**
     * Получить тренировку по ID
     * @param _id
     */
    async getOneById(_id: string) {
        try {
            return TrainingHistory.findOne({ _id });
        } catch (error) {
            logger.error('TrainingsService > getOneById > ', error);
        }
    }

    /**
     * Получить историю по training ID
     * @param trainingId
     */
    async getAllByTrainingId(trainingId: string) {
        try {
            return TrainingHistory.find({ trainingId }).exec();
        } catch (error) {
            logger.error('TrainingsService > getAllByTrainingId > ', error);
        }
    }

    /**
     * Получить всю историю тренировок пользователя с пагинацией
     * @param telegram_id
     * @param page Номер страницы (начиная с 1)
     * @param limit Количество записей на странице
     */
    async getAllByTelegramId(telegram_id: number, page = 1, limit = 10) {
        try {
            // Вычисляем индекс начальной записи для пагинации
            const startIndex = (page - 1) * limit;

            // Получаем тренировки для текущей страницы с учетом лимита и смещения
            const trainings = await TrainingHistory.find({
                userTgId: telegram_id,
            })
                .skip(startIndex)
                .limit(limit)
                .sort({
                    date: -1,
                })
                .exec();

            // Получаем общее количество тренировок в базе данных
            const totalTrainings = await TrainingHistory.countDocuments({
                userTgId: telegram_id,
            });

            // Вычисляем общее количество страниц
            const totalPages = Math.ceil(totalTrainings / limit);

            return {
                data: trainings,
                totalPages,
                currentPage: page,
                totalTrainings,
            };
        } catch (error) {
            logger.error('TrainingsService > getAllByTrainingId > ', error);
            throw new Error('Ошибка при получении данных тренировок');
        }
    }
}

import * as moment from 'moment/moment';
import { logger } from '../logger';


export class MomentTimer {

    /**
     * Добавляет необходимое кол-во дней к указанной дате
     * - Принимает дату в формате строки: '2023-12-11T11:00:00.217+00:00'
     * или в формате Date
     * - Возвращает строчное значение даты в формате DD.MM.YYYY
     * @param incrementalDate
     * @param days
     */
    addDays(incrementalDate: Date | string, days: number): string {
        try {
            // если incrementalDate: 2023-12-11T11:00:00.217+00:00
            const momentDate = moment(incrementalDate)
            const sevenDaysLater = momentDate.add(days, 'days'); // к примеру +7 дней
            console.log(`sevenDaysLater`, sevenDaysLater)
            console.log(`sevenDaysLater.format('DD.MM.YYYY')`, sevenDaysLater.format('DD.MM.YYYY'))
            return sevenDaysLater.format('DD.MM.YYYY') // тогда return 18.12.2023
        } catch (error) {
            logger.error(`MomentTimer > addDays > Error: ${error.message}`)
        }
    }

    /**
     * Преобразует 2030-01-11 в 11.01.2030
     * @param defaultDateFormat 2030-01-11
     */
    formatData(defaultDateFormat: string) {
        try {
            const defaultDataArr: string[] = defaultDateFormat.split('-')
            const year = defaultDataArr[0]
            const month = defaultDataArr[1]
            const day = defaultDataArr[2]
            return `${day}.${month}.${year}`
        } catch (e) {
            return defaultDateFormat
        }
    }

}

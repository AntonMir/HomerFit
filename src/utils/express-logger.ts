import 'colors';
import { Request, Response, NextFunction } from 'express';

/**
 * Логирование HTTP запросов
 */
const expressLogger = (req: Request, res: Response, next: NextFunction) => {
    // вывод через объект {}
    // console.log({
    //     URL: req.originalUrl, //EX: /api/user/getdata
    //     method: req.method,
    //     href: req.headers.referer || '',
    //     time: new Date().toUTCString(),
    //     body: req.body,
    //     // Browser: req.headers['user-agent']
    //     // fromIP: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
    //     // lastURL: req.url, //EX: ../getdata
    // });

    // вывод одной строкой '...'
    console.log(
        '>>> Request: '.gray,
        // '  URL:'.yellow, req.headers.referer || '',
        '  METHOD:'.yellow,
        req.method,
        '  PATH:'.yellow,
        req.originalUrl, //EX: /api/user/getdata
        '  DATE:'.yellow,
        new Date().toUTCString(),
        '  BODY:'.yellow,
        req.body
        // '  COOKIES:'.yellow, req.cookies,
        // '  BROWSER:'.yellow, req.headers['user-agent'],
        // '  FromIP:'.yellow, req.headers['x-forwarded-for'] || req.connection.remoteAddress,
        // '  LastURL:'.yellow, req.url     //EX: ../getdata
    );

    next();
};

export default expressLogger;

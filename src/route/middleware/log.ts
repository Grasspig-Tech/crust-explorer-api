import Log from '../../util/log';
import {Response, Request, NextFunction} from 'express';

export default (req: Request, res: Response, next: NextFunction) => {
  req.app.set('start-time', Date.now());
  function close() {
    if (res.app.get('start-time') !== '') {
      Log.info(
        `${req.originalUrl} ${req.method} ${res.statusCode} ${
          Date.now() - Number(res.app.get('start-time'))
        } ms`
      );
    }
    req.app.set('start-time', '');
  }
  res.once('finish', close);
  res.once('close', close);
  return next();
};

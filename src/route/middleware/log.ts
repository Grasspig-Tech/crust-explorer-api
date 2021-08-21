import Log from '../../util/log';
import {Response, Request, NextFunction} from 'express';

export default (req: Request, res: Response, next: NextFunction) => {
  Log.info(`${req.headers.host} ${req.method} ${res.statusCode} ${req.path}`);
  return next();
};

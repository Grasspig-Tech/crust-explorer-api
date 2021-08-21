import {getErr} from '../../util/get-result';
import Log from '../../util/log';
import {Response, Request, NextFunction} from 'express';
export default (
  error: Error | string,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const err = error instanceof Error ? error.message : error;
  Log.error(`${req.headers.host} ${req.method} ${req.path} error ${err}`);
  res.status(500).send(getErr({msg: err}));
  next();
};

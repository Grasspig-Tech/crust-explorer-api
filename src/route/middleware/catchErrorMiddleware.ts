import {getErr} from '../../util/get-result';
import {Response, Request, NextFunction} from 'express';
import logger from '../../util/logger';
export default (
  error: Error | string,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const err = error instanceof Error ? error.message : error;
  // logger.error(err);
  console.log(err);
  res.status(500).send(getErr({msg: err}));
  next();
};

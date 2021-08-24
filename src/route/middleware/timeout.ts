import {getErr} from './../../util/get-result';
import {Response, Request, NextFunction} from 'express';
// 设置超时链接
export default (req: Request, res: Response, next: NextFunction) => {
  res.setTimeout(60 * 1000, () => {
    return res.status(500).send(getErr({msg: 'server timeout'}));
  });
  next();
};

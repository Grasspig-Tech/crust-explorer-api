import express, {Response, Request, NextFunction} from 'express';
import {getResult} from '../../util/get-result';
import {getNetworkOverviewInfo} from '../../service/network_overview';

const Router = express.Router();

/*
    通过era获取

*/
Router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  return await getNetworkOverviewInfo()
    .then(result => {
      res.send(getResult({data: result}));
    })
    .catch(err => {
      next(err);
    });
});

export default Router;

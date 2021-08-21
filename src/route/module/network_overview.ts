import express, {Response, Request, NextFunction} from 'express';
import CrustWsPool from '../../api/crust-network';
import {getResult} from '../../util/get-result';
import {ApiPromise} from '@polkadot/api';
import {getNetworkOverviewInfo} from '../../service/network_overview';
import Conn from '../../api/crust-network/conn';
const Router = express.Router();

/*
    通过era获取

*/
Router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  // debugger
  const conn: Conn = await CrustWsPool.Conn();
  const api: ApiPromise = await conn.Api();
  conn.Lock(); // conn Lock
  try {
    const result = await getNetworkOverviewInfo(api);
    res.send(getResult({data: result}));
  } catch (error) {
    next(error);
  }
  conn.UnLock(); // conn unlock
});

export default Router;

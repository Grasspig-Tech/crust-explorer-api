import express, {Response, Request, NextFunction} from 'express';
// import { getValidators } from "../../service/validator"
import {getResult} from '../../util/get-result';
import CrustWsPool from '../../api/crust-network';
import {ApiPromise} from '@polkadot/api';
import {getAccounts} from '../../service/account';
import Conn from '../../api/crust-network/conn';
const Router = express.Router();

/* 获取账户信息
    /validator/all
    /list1
    /list2
    /list3

*/
Router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  // debugger;
  const conn: Conn = await CrustWsPool.Conn();
  const api: ApiPromise = await conn.Api();
  conn.Lock(); // conn Lock
  const {accounts} = req.body;
  // debugger;
  try {
    console.time('时间');
    const result = await getAccounts(accounts, api);
    console.timeEnd('时间');
    res.send(getResult({data: result}));
  } catch (error) {
    next(error);
  }
  conn.UnLock(); // conn unlink
});

export default Router;

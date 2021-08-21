import express, {Response, Request, NextFunction} from 'express';
// import { getValidators } from "../../service/validator"
import {getResult} from '../../util/get-result';
import GrantWs from '../../api/grant-ws';
import {ApiPromise} from '@polkadot/api';
import {getAccounts} from '../../service/account';
const Router = express.Router();

/* 获取账户信息
    /validator/all
    /list1
    /list2
    /list3

*/
Router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  // debugger;
  const api: ApiPromise = GrantWs.getApi(req.baseUrl + req.path) as ApiPromise;
  const {accounts} = req.body;
  // eslint-disable-next-line no-debugger
  debugger;
  try {
    console.time('时间');
    const result = await getAccounts(accounts, api);
    console.timeEnd('时间');
    res.send(getResult({data: result}));
  } catch (error) {
    next(error);
  }
});

export default Router;

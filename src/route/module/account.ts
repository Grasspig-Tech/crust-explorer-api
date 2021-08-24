import express, {Response, Request, NextFunction} from 'express';
// import { getValidators } from "../../service/validator"
import {getResult} from '../../util/get-result';
import {getAccounts} from '../../service/account';

const Router = express.Router();

/* 获取账户信息
    /validator/all
    /list1
    /list2
    /list3

*/
Router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  const {accounts} = req.body;
  return await getAccounts(accounts)
    .then(result => {
      res.send(getResult({data: result}));
    })
    .catch(err => {
      next(err);
    });
});

export default Router;

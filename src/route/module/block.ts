import express, {Response, Request, NextFunction} from 'express';
import {getBlockByBlockNum, getLastBlock} from '../../service/block';
import {getResult} from '../../util/get-result';

const Router = express.Router();
/* 获取区块列表
    /block/list?start=555&row=2

    /list1
    /list2
    /list3

*/
Router.get(
  '/list*',
  async (req: Request, res: Response, next: NextFunction) => {
    const start = Number(req.query.start);
    const row = Number(req.query.row);
    if ([start, row].includes(NaN)) {
      next('start和row必须是数字');
      return;
    }
    if (start < 0 || row <= 0) {
      next('start或row其中一个<=0');
      return;
    }
    const blockNums: number[] = []; // 查询的区块高度列表
    for (let i = 0; i < row; i++) {
      if (start - i < 0) {
        break;
      }
      blockNums.push(start - i);
    }
    return await getBlockByBlockNum(blockNums)
      .then(blocks => {
        res.status(200).send(getResult({data: blocks}));
      })
      .catch(err => {
        next(err);
      });
  }
);

/* 获取最新区块列表
    /block/last_block?row=2
*/
Router.get(
  '/last_block',
  async (req: Request, res: Response, next: NextFunction) => {
    let row = Number(req.query.row);
    row = row > 0 ? row : 1;
    return await getLastBlock({row})
      .then(blocks => {
        res.send(getResult({data: blocks}));
      })
      .catch(err => {
        next(err);
      });
  }
);

export default Router;

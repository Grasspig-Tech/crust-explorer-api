import express, {Response, Request, NextFunction} from 'express';
import {getBlockByBlockNum, getLastBlock} from '../../service/block';
import {getResult} from '../../util/get-result';
// import logger from "../../util/logger"
import GrantWs from '../../api/grant-ws';
import {ApiPromise} from '@polkadot/api';
import {CeBlock} from '../../model';
const Router = express.Router();
/*
    获取单个区块
*/
Router.get(
  '/block_num/:blockNum?',
  async (req: Request, res: Response, next: NextFunction) => {
    const api: ApiPromise = await GrantWs.connect('/block_num');
    const blockNum = req.params.blockNum ? req.params.blockNum : 2301731;
    const NumberBlockNum = Number(blockNum);
    try {
      const blockInfo: CeBlock[] = await getBlockByBlockNum(
        [NumberBlockNum],
        api
      );
      res.send(getResult({data: blockInfo as any}));
    } catch (error) {
      next(error);
    }
    /* 查询成功 */
    // res.send(response);
  }
);
/* 获取区块列表
    /block/list?start=555&row=2

    /list1
    /list2
    /list3

*/
Router.get(
  '/list1',
  async (req: Request, res: Response, next: NextFunction) => {
    // debugger
    const api: ApiPromise = GrantWs.getApi(
      req.baseUrl + req.path
    ) as ApiPromise;

    // console.log("进来一个");
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
    const blockNums: number[] = []; //查询的区块高度列表
    for (let i = 0; i < row; i++) {
      if (start - i < 0) {
        break;
      }
      blockNums.push(start - i);
    }
    try {
      const blocks: CeBlock[] = await getBlockByBlockNum(blockNums, api);
      // debugger;
      // console.log(res);
      res.status(200).send(getResult({data: blocks}));
      return;
    } catch (error) {
      next(error);
    }
  }
);
Router.get(
  '/list2',
  async (req: Request, res: Response, next: NextFunction) => {
    const api: ApiPromise = GrantWs.getApi(
      req.baseUrl + req.path
    ) as ApiPromise;
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
    const blockNums: number[] = []; //查询的区块高度列表
    for (let i = 0; i < row; i++) {
      if (start - i < 0) {
        break;
      }
      blockNums.push(start - i);
    }
    try {
      const blocks: CeBlock[] = await getBlockByBlockNum(blockNums, api);
      // debugger;
      // console.log(res);
      res.status(200).send(getResult({data: blocks}));
      return;
    } catch (error) {
      next(error);
    }
  }
);
Router.get(
  '/list3',
  async (req: Request, res: Response, next: NextFunction) => {
    const api: ApiPromise = GrantWs.getApi(
      req.baseUrl + req.path
    ) as ApiPromise;
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
    const blockNums: number[] = []; //查询的区块高度列表
    for (let i = 0; i < row; i++) {
      if (start - i < 0) {
        break;
      }
      blockNums.push(start - i);
    }
    try {
      const blocks: CeBlock[] = await getBlockByBlockNum(blockNums, api);
      // debugger;
      // console.log(res);
      res.status(200).send(getResult({data: blocks}));
      return;
    } catch (error) {
      next(error);
    }
  }
);
/* 获取最新区块列表
    /block/last_block?row=2
*/
Router.get(
  '/last_block',
  async (req: Request, res: Response, next: NextFunction) => {
    // debugger;
    const api: ApiPromise = GrantWs.getApi(
      req.baseUrl + req.path
    ) as ApiPromise;
    let row = Number(req.query.row);
    row = row > 0 ? row : 1;

    try {
      const blocks: CeBlock[] = await getLastBlock({row, api});
      res.send(getResult({data: blocks}));
    } catch (error) {
      next(error);
    }
  }
);

export default Router;

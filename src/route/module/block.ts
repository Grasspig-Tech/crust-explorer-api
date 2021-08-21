import express, {Response, Request, NextFunction} from 'express';
import {getBlockByBlockNum, getLastBlock} from '../../service/block';
import CrustWsPool from '../../api/crust-network';
import {getResult} from '../../util/get-result';
import {ApiPromise} from '@polkadot/api';
import {CeBlock} from '../../model';
import Conn from '../../api/crust-network/conn';
const Router = express.Router();
/*
    获取单个区块
*/
Router.get(
  '/block_num/:blockNum?',
  async (req: Request, res: Response, next: NextFunction) => {
    const conn: Conn = await CrustWsPool.Conn();
    const api: ApiPromise = await conn.Api();
    conn.Lock(); // conn Lock
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
    conn.UnLock(); // conn unlock
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
    const conn: Conn = await CrustWsPool.Conn();
    const api: ApiPromise = await conn.Api();
    conn.Lock(); // conn Lock
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
      res.status(200).send(getResult({data: blocks}));
      return;
    } catch (error) {
      next(error);
    }
    conn.UnLock(); // conn unlock
  }
);
Router.get(
  '/list2',
  async (req: Request, res: Response, next: NextFunction) => {
    const conn: Conn = await CrustWsPool.Conn();
    const api: ApiPromise = await conn.Api();
    conn.Lock(); // conn Lock
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
      res.status(200).send(getResult({data: blocks}));
      return;
    } catch (error) {
      next(error);
    }
    conn.UnLock(); // conn unlock
  }
);
Router.get(
  '/list3',
  async (req: Request, res: Response, next: NextFunction) => {
    const conn: Conn = await CrustWsPool.Conn();
    conn.Lock(); // conn Lock
    const api: ApiPromise = await conn.Api();
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
      res.status(200).send(getResult({data: blocks}));
      return;
    } catch (error) {
      next(error);
    }
    conn.UnLock(); // conn unlock
  }
);
/* 获取最新区块列表
    /block/last_block?row=2
*/
Router.get(
  '/last_block',
  async (req: Request, res: Response, next: NextFunction) => {
    const conn: Conn = await CrustWsPool.Conn();
    const api: ApiPromise = await conn.Api();
    conn.Lock(); // conn Lock
    let row = Number(req.query.row);
    row = row > 0 ? row : 1;
    try {
      const blocks: CeBlock[] = await getLastBlock({row, api});
      res.send(getResult({data: blocks}));
    } catch (error) {
      next(error);
    }
    conn.UnLock(); // conn unlock
  }
);

export default Router;

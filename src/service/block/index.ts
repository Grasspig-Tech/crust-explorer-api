import {ApiPromise} from '@polkadot/api';
import {queryBlockByBlockNums} from '../../api/block';
// import { Block } from "../../interface"
/**
 * 通过区块头获取区块，支持多个
 *
 * @export
 */
export async function getBlockByBlockNum(blockNums: number[], api: ApiPromise) {
  try {
    // let queryPromiseAll = blockNums.map(num => {
    //     return queryOneBlockByBlockNum(num, api);
    // });
    // let blocks = [];
    // for (let i = 0; i < queryPromiseAll.length; i++) {
    //     try {
    //         blocks.push(await queryPromiseAll[i]);
    //     } catch (error) {
    //         blocks.push({ blockNum: blockNums[i] });
    //     }
    // };
    const blocks = await queryBlockByBlockNums(blockNums, api);
    // let blocks: Block[] = await Promise.all(queryPromiseAll);
    return blocks;
  } catch (error) {
    throw new Error(error);
  }
}

/**
 * 获取最新的row个区块
 *
 * @export
 * @param {{ row: number }} { row = 1 }
 * @return {*}
 */
export async function getLastBlock({
  row = 1,
  api,
}: {
  row: number;
  api: ApiPromise;
}) {
  try {
    const lastBlockNum: number = (await api?.query.system.number())?.toJSON();
    const blockNums: number[] = []; //查询的区块高度列表
    for (let i = lastBlockNum; i > lastBlockNum - row; i--) {
      blockNums.push(i);
    }
    // debugger;
    const blocks = await queryBlockByBlockNums(blockNums, api);
    return blocks;
  } catch (error) {
    throw new Error(error);
  }
}

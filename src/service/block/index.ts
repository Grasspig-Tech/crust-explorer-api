import {ApiPromise} from '@polkadot/api';
import {queryBlockByBlockNums} from '../../api/block';
import CrustPool from '../../crust-pool';
/**
 * 通过区块头获取区块，支持多个
 *
 * @export
 */
export async function getBlockByBlockNum(blockNums: number[]) {
  return await queryBlockByBlockNums(blockNums)
    .then(blocks => {
      return blocks;
    })
    .catch(err => {
      throw err;
    });
}

/**
 * 获取最新的row个区块
 *
 * @export
 * @param {{ row: number }} { row = 1 }
 * @return {*}
 */
export async function getLastBlock({row = 1}: {row: number}) {
  try {
    const lastBlockNum: number = (
      await CrustPool.Run<any>((api: ApiPromise) => {
        return api.query.system.number();
      })
    )?.toJSON();
    const blockNums: number[] = []; // 查询的区块高度列表
    for (let i = lastBlockNum; i > lastBlockNum - row; i--) {
      blockNums.push(i);
    }
    const blocks = await queryBlockByBlockNums(blockNums);
    return blocks;
  } catch (error) {
    throw new Error(error);
  }
}

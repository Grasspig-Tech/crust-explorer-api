import {ApiPromise} from '@polkadot/api';
import {queryOneBlockByBlockNum} from '../../api/block';
import {Block} from '../../interface';
import {queryEras} from '../../api/era';
/**
 * 通过区块头获取区块，支持多个
 *
 * @export
 */
export async function getEraInfo(api: ApiPromise) {
  try {
    const {response: res} = await queryEras({api});
    return res;
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
    // console.log(blockNums.toString())
    const blockPromise = blockNums.map(it => {
      console.log(it);
      return queryOneBlockByBlockNum(it, api);
    });
    const blocks: Block[] = await Promise.all(blockPromise);
    return blocks;
  } catch (error) {
    throw new Error(error);
  }
}

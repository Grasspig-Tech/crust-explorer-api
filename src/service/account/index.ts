import {ApiPromise} from '@polkadot/api';
import {queryOneBlockByBlockNum} from '../../api/block';
import {Block, AccountArg} from '../../interface';
import {queryAccount} from '../../api/account';
/**
 * 通过区块头获取区块，支持多个
 *
 * @export
 */
export async function getAccounts(accounts: AccountArg[], api: ApiPromise) {
  try {
    const res = await queryAccount(accounts, api);
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
    const blockPromise = blockNums.map(it => {
      return queryOneBlockByBlockNum(it, api);
    });
    const blocks: Block[] = await Promise.all(blockPromise);
    return blocks;
  } catch (error) {
    throw new Error(error);
  }
}

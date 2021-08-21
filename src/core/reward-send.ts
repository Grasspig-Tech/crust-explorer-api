import {ApiPromise, WsProvider} from '@polkadot/api';
import {typesBundleForPolkadot} from '@crustio/type-definitions';
import {CHAIN_WS_URL} from '../config';
import {PromiseFuncOrPlainFunc} from '../interface';
import {Keyring} from '@polkadot/keyring'; // eslint-disable-line node/no-extraneous-import
import {ACCOUNT_PASSWD, ACCOUNT_BACKUP} from '../config';
import Log from '../util/log';

/**
 * @description 提交交易
 * @author huazhuangnan
 * @date 2021/06/05
 * @param {ApiPromise} api
 */
async function real_sendReward(api: ApiPromise) {
  // 交易提交签名
  const keyring = new Keyring({type: 'sr25519'});
  // const pair = await keyring.addFromJson(JSON.parse(ACCOUNT_BACKUP));

  const [activeEra, address, pair] = await Promise.all([
    api.query.staking.activeEra().then(res => (res.toJSON() as any).index),
    api.query.staking
      .bonded('5F98z3EwEGKhGip2dm6QU1fTw1YPb5puTPPhZkZvoZcYrLkL')
      .then(res => res.toString()),
    keyring.addFromJson(JSON.parse(ACCOUNT_BACKUP)),
  ]);
  // const activeEra = ((await api.query.staking.activeEra()).toJSON() as any).index
  // const address = (await api.query.staking.bonded('5F98z3EwEGKhGip2dm6QU1fTw1YPb5puTPPhZkZvoZcYrLkL')).toString();
  const ledgerInfo = (await api.query.staking.ledger(address)).toJSON();
  try {
    pair.decodePkcs8(ACCOUNT_PASSWD);
  } catch (error) {
    Log.error(`login account error : ${error}`);
  }
  const list = (ledgerInfo as any).claimedRewards;
  const start = list.pop() + 1;
  let pAll = Array(activeEra - start < 0 ? 0 : activeEra - start)
    .fill('占位')
    .map((it, i) => {
      return (async () => {
        const transfer = await api.tx.staking.rewardStakers(address, i + start);
        try {
          const hash = await transfer.signAndSend(pair);
          Log.info(`for transfer send hash : ${hash}`);
        } catch (error) {
          Log.error(`for transfer send error : ${error}`);
        }
      })();
    });
  // unlock 提交签名
  const unlocking = (ledgerInfo as any).unlocking;
  if (unlocking && unlocking.length > 0) {
    pAll = [
      ...pAll,
      ...unlocking.map((item: number) => {
        return (async () => {
          const transfer = await api.tx.staking.rewardStakers(address, item);
          try {
            const hash = await transfer.signAndSend(pair);
            Log.info(`unlocking transfer send hash : ${hash}`);
          } catch (error) {
            Log.error(`unlocking transfer send error : ${error}`);
          }
        })();
      }),
    ];
  }
  await Promise.all(pAll);
  // console.log('提交一次了');
  // for (let i = start; i < activeEra; i++) {
  //     const transfer = await api.tx.staking.rewardStakers(address, i);
  //     try {
  //         const hash = await transfer.signAndSend(pair);
  //         Log.info(`for transfer send hash : ${hash}`);
  //     } catch (error) {
  //         Log.error(`for transfer send error : ${error}`);
  //         continue;
  //     }
  // }

  // if (unlocking && unlocking.length > 0) {
  //     unlocking.forEach(async (item: number) => {
  //         const transfer = await api.tx.staking.rewardStakers(address, item);
  //         try {
  //             const hash = await transfer.signAndSend(pair);
  //             Log.info(`unlocking transfer send hash : ${hash}`);
  //         } catch (error) {
  //             Log.error(`unlocking transfer send error : ${error}`);
  //         }
  //     })
  // }
}

export default (config: {
  beforeRun?: PromiseFuncOrPlainFunc;
  afterRun?: PromiseFuncOrPlainFunc;
}) => {
  return async () => {
    config.beforeRun && (await config.beforeRun());
    // 建立连接
    const provider = new WsProvider(CHAIN_WS_URL);
    // 错误捕捉
    provider.on('error', (err: any) => {
      throw err;
    });
    const api = new ApiPromise({
      provider,
      typesBundle: typesBundleForPolkadot,
    });
    // 错误捕捉
    api.on('error', (err: any) => {
      throw err;
    });
    // 等待连接完成
    await api.isReady;
    await real_sendReward(api).catch((err: any) => {
      throw err;
    });
    await api.disconnect().catch((err: any) => {
      throw err;
    });
    config.afterRun && (await config.afterRun());
  };
};

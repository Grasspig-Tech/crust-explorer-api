// 入口
import {ApiPromise} from '@polkadot/api';
import {EraArg, Role} from '../../interface';
import {CeMember} from '../../model';
import {getAccountDisplay} from '../../util';
import CrustPool from '../../crust-pool/';
/**
 *
 * @param param0
 * @returns
 */
export async function queryMember(
  accounts: Array<{
    address: string; // 存储账户，不能是控制账户
    role: Role;
    rank: number;
  }>,
  eraInfo: EraArg
): Promise<CeMember[]> {
  const rewardPoints = (
    await CrustPool.Run<any>((api: ApiPromise) => {
      return api.query.staking.erasRewardPoints(eraInfo.activeEra);
    })
  ).toJSON().individual as {[tmp: string]: number};

  const pAll = accounts.map(it => {
    return queryOneMember(
      {
        ...it,
        rewardPoint: rewardPoints[it.address] ? rewardPoints[it.address] : -1,
      },
      eraInfo
    );
  });
  return await Promise.all(pAll)
    .then(res => res)
    .catch(err => {
      throw err;
    });
}
export async function queryOneMember(
  {
    address,
    role,
    rank,
    rewardPoint,
  }: {
    address: string;
    role: Role;
    rank: number;
    rewardPoint: number;
  },
  eraInfo: EraArg
): Promise<CeMember> {
  if (!address) {
    throw 'address not find';
  }
  const queryRes = await Promise.all([
    CrustPool.Run<any>((api: ApiPromise) => {
      return api.query.staking.bonded(address);
    }),
    CrustPool.Run<any>((api: ApiPromise) => {
      return api.query.staking.erasStakers(eraInfo.activeEra, address);
    }),
  ]);
  /* 控制账户地址 */
  const controllerAccountAddress: string = queryRes[0].toJSON() as string;
  const [accountDisplay, controllerAccountDisplay] = await Promise.all([
    getAccountDisplay([{address}]),
    getAccountDisplay([{address: controllerAccountAddress}]),
  ]);
  /* 提名人 */
  const nominator: Array<{who: string; value: number | string}> = (
    queryRes[1].toJSON() as any
  ).others as Array<{who: string; value: number | string}>;
  const ceMember: CeMember = {
    era: eraInfo.activeEra,
    role,
    memberRank: rank,
    countNominators: nominator.length,
    grandpaVote: 0,
    sessionKey: '',
    latestMining: 0,
    rewardPoint,
    accountAddress: address,
    controllerAccountAddress,
    accountDisplay: JSON.stringify(accountDisplay),
    controllerAccountDisplay: JSON.stringify(controllerAccountDisplay),
  };
  return ceMember;
}

// 入口
import {ApiPromise} from '@polkadot/api';
import {EraArg} from '../../interface';
import {trillionCruFormat} from '../../util';
import {CeBondedPledge} from '../../model';

/**
 *
 * @param param0
 * @returns
 */
export async function queryPledge(
  accounts: {
    address: string; //存储账户，不能是控制账户
    // role?: TinyRole,//1为验证人，2为候选验证人
  }[],
  api: ApiPromise,
  eraInfo: EraArg
): Promise<CeBondedPledge[]> {
  const pAll = accounts.map(it => {
    return queryOnePledge(it, api, eraInfo);
  });
  try {
    const ceBondedPledgeList = await Promise.all(pAll);
    return ceBondedPledgeList;
  } catch (error) {
    throw new Error(error);
  }
}

export async function queryOnePledge(
  {
    address,
  }: // role
  {
    address: string;
    // role?: number,//1为验证人，2为候选验证人
  },
  api: ApiPromise,
  eraInfo: EraArg
): Promise<CeBondedPledge> {
  // debugger;
  if (!address) {
    throw new Error('address无效');
  }

  const queryResult = await api.queryMulti([
    [api.query.staking.validators, address],
    [api.query.staking.stakeLimit, address],
    [api.query.staking.erasStakersClipped, [eraInfo?.activeEra, address]],
    [api.query.staking.bonded, address],
    // [api.query.staking.erasRewardPoints, eraInfo.activeEra]
  ]);
  /* reward_point时代指数 = score得分  */
  // const rewardPoints = (queryResult[4] as any).toJSON().individual as { [tmp: string]: number };
  // 担保费率 = 扣留费率
  const guaranteeFee = (queryResult[0] as any).guarantee_fee.toJSON();
  // 质押上限
  const pledgeMax = Number(queryResult[1]?.toJSON());
  //含有验证人冻结，全网冻结，others(提名人地址和投票)
  const pledgeInfo: any = queryResult[2].toJSON();
  // 控制账户地址
  const controllAddress: string = queryResult[3].toJSON() as string;

  const erasStakersStash = (pledgeInfo as any).others.map(
    (e: {who: any}) => e.who
  );
  const pAll22 = controllAddress
    ? [
        api.query.staking.ledger(controllAddress),
        api.query.staking.guarantors.multi(erasStakersStash),
      ]
    : [api.query.staking.guarantors.multi(erasStakersStash)];
  const queryResult22 = await Promise.all(pAll22 as any);
  // 质押信息
  // debugger;
  const ledgerInfo = (queryResult22[0] as any).toJSON();
  // 总质押
  let pledgeTotal = Number((ledgerInfo as any)?.active);
  // 担保人 [{who,value}]
  const stakersGuarantees: {who: string; value: string | number}[] =
    queryResult22[1] as any;
  /* 验证人冻结，全网冻结，others(提名人地址和投票) */
  let own: string = pledgeInfo.own as string;
  let total: string = pledgeInfo.total as string;
  const others: {who: string; value: string}[] = pledgeInfo.others as {
    who: string;
    value: string;
  }[];
  own = String(Number(own));
  total = String(Number(total));
  /* 提名者冻结 = 全网冻结 - 验证人冻结  */
  const bondedNominators = String(Number(total) - Number(own));
  /* 他人有效质押 */
  let otherActivePledge = 0;
  others &&
    others.forEach(item => {
      otherActivePledge += Number(item.value);
    });
  if (stakersGuarantees) {
    stakersGuarantees
      .filter(guarantee => guarantee)
      .map(guarantee => JSON.parse(JSON.stringify(guarantee) as any))
      .filter(guarantee => guarantee)
      .reduce(
        (prevGuarantee, curGuarantee) => [
          ...prevGuarantee,
          ...curGuarantee.targets,
        ],
        []
      )
      .filter((target: any) => target.who.toString() === address?.toString())
      .forEach((target: any) => (pledgeTotal += Number(target.value)));
  }

  const cePledge: CeBondedPledge = {
    era: eraInfo?.activeEra as number,
    accountAddress: address,
    bondedNominators: trillionCruFormat(bondedNominators),
    bondedOwner: trillionCruFormat(own),
    ownerActivePledge: trillionCruFormat(own),
    otherActivePledge: trillionCruFormat(otherActivePledge),
    pledgeMax: trillionCruFormat(pledgeMax),
    pledgeTotal: trillionCruFormat(pledgeTotal),
    guaranteeFee: trillionCruFormat(guaranteeFee, 9), //如0.4，其实就是40%
    score: 0,
  };

  return cePledge;
}

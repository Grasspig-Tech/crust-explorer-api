// 入口
import { ApiPromise } from '@polkadot/api';
import { EraArg, Role } from "../../interface"
import { CeMember } from "../../model"
import { getAccountDisplay } from "../../util"

/**
 * 
 * @param param0 
 * @returns 
 */
export async function queryMember(
    accounts
        : {
            address: string,//存储账户，不能是控制账户
            role: Role,
            rank: number,
        }[],
    api: ApiPromise,
    eraInfo: EraArg,
): Promise<CeMember[]> {
    const rewardPoints = (await api.query.staking.erasRewardPoints(eraInfo.activeEra)).toJSON().individual as { [tmp: string]: number };

    let pAll = accounts.map(it => {
        return queryOneMember({ ...it, rewardPoint: rewardPoints[it.address] ? rewardPoints[it.address] : -1 }, api, eraInfo);
    })
    try {
        let ceMemberList = await Promise.all(pAll)
        return ceMemberList;
    } catch (error) {
        throw new Error(error)
    }
}
export async function queryOneMember(
    {
        address,
        role,
        rank,
        rewardPoint
    }: {
        address: string,
        role: Role,
        rank: number,
        rewardPoint: number
    },
    api: ApiPromise,
    eraInfo: EraArg
): Promise<CeMember> {
    // debugger;
    if (!address) {
        throw new Error("address无效")
    }
    let queryRes = await api.queryMulti([
        [api.query.staking.bonded, address],
        [api.query.staking.erasStakers, [eraInfo.activeEra, address]],

    ]);
    /* 控制账户地址 */
    const controllerAccountAddress: string = queryRes[0].toJSON() as string;
    let [accountDisplay, controllerAccountDisplay] = await getAccountDisplay([{ address }, { address: controllerAccountAddress }], api);
    /* 提名人 */
    const nominator: { who: string, value: number | string }[] = (queryRes[1].toJSON() as any).others as { who: string, value: number | string }[];
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

    }
    return ceMember;


}


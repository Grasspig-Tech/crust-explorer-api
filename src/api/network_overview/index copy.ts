// // 入口
// import { ApiPromise } from '@polkadot/api';
// import { ResultInfo } from '../../interface';
// import { CeNetworkOverview } from "../../model/ce_network_overview"
// import { AccountData, AccountInfo } from "@polkadot/types/interfaces"
// import { EraResult } from "../era/interface"
// import { getAccountDisplay, getBlockTimestamp, trillionCruFormat } from "../../util"
// import { queryEras } from "../era"
// export interface AccountArg {
//     address: string,
//     role?: number,//1为验证人，2为候选验证人,3为提名人
//     accountType: number,//1为存储账户，2为控制账户
//     // api: ApiPromise
// }
// /**
//  * @param accounts 
//  * @param api 
//  * @returns 
//  */
// export async function queryNetworkOverview(
//     api: ApiPromise
// ): Promise<CeNetworkOverview> {
//     const eras = await queryEras({ api });
//     /* 总存储量 */
//     const totalStorage = eras.response.bondedPledges.reduce((prev, cur) => prev + Number(cur.pledgeMax), 0);
//     /* 总发行量 */
//     const totalCirculation = (await api.query.balances.totalIssuance()).toString();
//     /* 近24h总产出 */
//     // const totalOutputLast24 = '';
//     /* 最新区块高度 */
//     const blockHeight = (await api.query.system.number())?.toJSON();
//     /* 最新确认区块高度 */
//     const blockHeightConfirmed = (await api.derive.chain.bestNumberFinalized()).toJSON();
//     /* 最新出块时间戳 */
//     const blockLastTime = await getBlockTimestamp(blockHeight, 1, api);
//     let sortBondedPledges = JSON.parse(JSON.stringify(eras.response.bondedPledges)).sort((a: any, b: any) => a.ownerActivePledge - b.ownerActivePledge);

//     /* 最低质押量，所有验证人包括候选的最低自身有效质押ownerActivePledge */
//     const pledgeMinimum = sortBondedPledges[0].ownerActivePledge;//
//     /* 每T质押量 */
//     let pledgePer = api.consts.staking.sPowerRatio;
//     /* 有效质押总量，所有验证人包括候选的自身有效质押ownerActivePledge相加
//         🍔验证正确，https://apps.crust.network/#/staking/targets
//     */
//     let pledgeTotalActive: number = eras.response.bondedPledges.reduce((prev, cur) => prev + Number(cur.ownerActivePledge), 0);
//     pledgeTotalActive += eras.response.nominators.reduce((prev, cur) => prev + Number(cur.bonded), 0)
//     /* 可质押总量，所有验证人包括候选的质押总量pledgeTotal */
//     let pledgeAbleNum = eras.response.bondedPledges.reduce((prev, cur) => prev + Number(cur.pledgeTotal), 0);
//     /* 平均质押量  , 可质押总量/验证人数量，包括候选验证人*/
//     const pledgeAvg = pledgeAbleNum / (eras.response.bondedPledges.length);
//     debugger;
//     /* Era倒计时 */
//     // let countdownEra = 0;
//     /* session倒计时 */
//     // let countdownSession = 0;
//     /* 流通率 */
//     // let rateFlow = 0;
//     /* 通胀率 */
//     // let rateInflation = 0;
//     /* 当前手续费 */
//     // let baseFee = '0';
//     /* 持有账号数，返回的accounts数量 */
//     let accountHold = eras.response.accounts.length;
//     /* 担保人数 */
//     let numberGuarantee = eras.realNominatorLen;
//     /* 验证人数，包括候选验证人 */
//     // let numberValidator = (await api.query.staking.validators.entries()).length;
//     let numberValidator = eras.validatorLen + eras.waitingValidatorLen;
//     /* 转账次数 */
//     // let numberTransfer = 0;
//     /* 交易次数 */
//     // let numberTrade = 0;
//     /* 有效否：1-生效；0-失效 */
//     // let status = 0;


//     const ceNetworkOverview: CeNetworkOverview = {
//         totalStorage: '0',
//         totalCirculation: trillionCruFormat(totalCirculation),
//         totalOutputLast24: '0',
//         blockHeight,
//         blockHeightConfirmed,
//         blockLastTime: String(blockLastTime),
//         pledgeMinimum,
//         pledgeAvg: String(pledgeAvg),
//         pledgePer: String(pledgePer),
//         pledgeTotalActive: String(pledgeTotalActive),
//         pledgeAbleNum: String(pledgeAbleNum),
//         countdownEra: '0',
//         countdownSession: '0',
//         rateFlow: '0',
//         rateInflation: '0',
//         baseFee: '0',
//         accountHold,
//         numberGuarantee,
//         numberValidator,
//         numberTransfer: 0,
//         numberTrade: 0,
//         status: 0,
//     }

//     return ceNetworkOverview



// }



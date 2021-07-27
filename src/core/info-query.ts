// // 入口
// import { ApiPromise } from '@polkadot/api';
// import { ResultInfo } from '../interface';
// import CSClient from '../api/cs-client';
// import CClient from '../api/c-client';

// /**
//  * @description 获取信息
//  * @author huazhuangnan
//  * @date 2021/09/04
//  * @param {ApiPromise} api
//  * @return {*}  {Promise<ResultInfo>}
//  */
// export default async function infoQuery(
//     api: ApiPromise,
//     poolAddress: string,
//     earningsAddress: string,
//     controlAddress: string,
//     blockNum: number
// ): Promise<ResultInfo> {
//     const [
//         walletInfo, //账户钱包有关
//         address, //？？质押总量地址
//         activeEra, // 当前纪元
//         accountInfo, // 用户信息
//         validators, // 担保费率
//         stakeLimit, // 质押上限
//         erasStakersClipped, //有效质押
//     ] = await Promise.all([
//         api.query.system.account(earningsAddress).then(res => res.toJSON()),
//         api.query.staking.bonded(poolAddress).then(res => res.toString()),
//         api.query.staking.activeEra().then(res => (res.toJSON() as any).index),
//         api.derive.accounts.info(poolAddress),
//         api.query.staking.validators(controlAddress).then(res => res.toJSON()),
//         api.query.staking.stakeLimit(controlAddress).then(res => res.toString()),
//         (async () => {
//             return (
//                 await api.query.staking.erasStakersClipped(
//                     Number((await api.query.staking.currentEra()).toJSON()),
//                     controlAddress
//                 )
//             ).toJSON();
//         })(),
//     ]);
//     const [ledgerInfo, erasStakersStashExposure] = await Promise.all([
//         api.query.staking.ledger(address).then(res => res.toJSON()),
//         api.query.staking.erasStakers(activeEra, address).then(res => res.toJSON()),
//     ]);
//     let totalStaked = Number((ledgerInfo as any)?.active);
//     const erasStakersStash = (erasStakersStashExposure as any).others.map(
//         (e: { who: any }) => e.who
//     );
//     // console.log(">>>>>>>>>>>>>>>>>>>>>>>>>")
//     // console.log(activeEra, erasStakersStashExposure, erasStakersStash)
//     // console.log(await api.query.staking.currentEra().then(res => res.toJSON()))
//     // console.log(api.consts.staking.marketStakingPotDuration.toHuman());
//     // console.log(api.consts.staking.slashDeferDuration.toHuman())
//     // console.log(api.consts.staking.bondingDuration.toHuman())
//     // console.log(api.consts.staking.authoringAndStakingRatio.toHuman())
//     // console.log(">>>>>>>>>>>>>>>>>>>>>>>>>")
//     const stakersGuarantees = await api.query.staking.guarantors.multi(
//         erasStakersStash
//     );
//     if (stakersGuarantees) {
//         stakersGuarantees
//             .filter(guarantee => guarantee)
//             .map(guarantee => JSON.parse(JSON.stringify(guarantee) as any))
//             .filter(guarantee => guarantee)
//             .reduce(
//                 (prevGuarantee, curGuarantee) => [
//                     ...prevGuarantee,
//                     ...curGuarantee.targets,
//                 ],
//                 []
//             )
//             .filter(
//                 (target: any) => target.who.toString() === poolAddress?.toString()
//             )
//             .forEach((target: any) => (totalStaked += target.value));
//     }
//     // totalStaked = Number((ledgerInfo as any)?.active)
//     // if (stakersGuarantees) {
//     //     for (const stakersGuarantee of stakersGuarantees) {
//     //         if (stakersGuarantee) {
//     //             for (const target of (JSON.parse(JSON.stringify(stakersGuarantee)) as any)?.targets) {
//     //                 if (target.who.toString() === poolAddress?.toString()) {
//     //                     totalStaked += target.value
//     //                 }
//     //             }
//     //         }
//     //     }
//     // }
//     // 存储总量

//     const csClient = new CSClient();
//     const csRes = await csClient.queryOwners(poolAddress); // poolAddress
//     const arr = csRes?.data?.data[0]?.member;
//     let totalSpace = 0;
//     arr && arr.forEach((it: any) => (totalSpace += Number(it.storageCapacity)));
//     // for (let index = 0; index < arr?.length; index++) {
//     //     const element = arr[index];
//     //     totalSpace += Number(element.storageCapacity);
//     // }
//     // 计算收益
//     const cClient = new CClient();
//     const cRes = await cClient.queryAccountRewards(earningsAddress); //  earningsAddress
//     let earnings = 0;
//     const array: Array<any> = cRes?.data.list;
//     let invalidBlockNumIndex = !array
//         ? 0
//         : array.findIndex(it => it.block_num > blockNum);
//     invalidBlockNumIndex =
//         invalidBlockNumIndex === -1 ? array.length : invalidBlockNumIndex;
//     // let lastBlockNumIndex = ~invalidBlockNumIndex?array.length-1 : invalidBlockNumIndex
//     array &&
//         array
//             .filter(
//                 (it, index) => index < invalidBlockNumIndex && JSON.parse(it?.params)
//             )
//             .map(it => JSON.parse(it.params))
//             .filter(it => it)
//             .reduce((prevItem, curItem) => [...prevItem, ...curItem], [])
//             .filter((it: any) => it && it.type.toString() === 'Balance')
//             .forEach((it: any) => (earnings += Number(it.value)));

//     // for (let index = 0; index < array?.length; index++) {
//     //     const item = array[index];
//     //     if (item?.block_num > blockNum) {
//     //         JSON.parse(item?.params).forEach((item: any) => {
//     //             if (item.type.toString() === 'Balance') earnings += Number(item.value);
//     //         });
//     //     } else {
//     //         break;
//     //     }
//     // }
//     const [
//         merchants, // 全网总存储量
//         tokenInfo, // 全网总质押
//     ] = await Promise.all([csClient.queryMerchants(), cClient.queryToken()]);
//     // console.log("-=-=-=-=-=-=-=-=-=-=--=-=-=-=-=-=-=-=-=-=-=-=--=")
//     // console.log(
//     merchants,
//         tokenInfo,
//         totalStaked,
//         blockNum,
//         merchants.data?.totalStorage,
//         Number(tokenInfo.data?.detail.CRU.bonded_locked_balance) / 1e12 || 0,
//         tokenInfo.data?.detail.CRU,

//   )
//     // console.log("-=-=-=-=-=-=-=-=-=-=--=-=-=-=-=-=-=-=-=-=-=-=--=")
//     return {
//         poolName:
//             accountInfo.identity.display ||
//             accountInfo.nickname ||
//             accountInfo.accountId?.toString() ||
//             '', // 节点名称
//         poolAddress,
//         earningsAddress,
//         controlAddress,
//         earningsAmount: (walletInfo?.data as any).free / 1e12 || 0, // 收益余额
//         totalSpace: totalSpace || 0, // 存储总量
//         pledgeLimit: Number(stakeLimit) / 1e12 || 0, // 质押上限制
//         totalPledge: totalStaked / 1e12 || 0, // 质押总量
//         activePledge: Number(erasStakersClipped.total) / 1e12 || 0, // 有效质押
//         rate: Number(validators.guarantee_fee) / 1e9 || 0, // 担保费率 ,
//         earnings: earnings / 1e12, // 收益
//         blockNum: cRes?.data.count > 0 ? cRes?.data?.list[0]?.block_num : blockNum, // 区块高度
//         networkSpace: merchants.data?.totalStorage || 0, // 全网算力
//         networkPledge:
//             Number(tokenInfo.data?.detail.CRU.bonded_locked_balance) / 1e12 || 0, // 总质押
//     };
// }

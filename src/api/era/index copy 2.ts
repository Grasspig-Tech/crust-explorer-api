



// // 入口
// import { ApiPromise } from '@polkadot/api';
// import { queryCeValidatorByValidatorHash } from "../validator"
// import { EraArg, Validator } from "../validator/interface"
// import { EraResult } from "./interface"
// import { queryAccount } from "../account"
// import {
//     trillionCruFormat, getControllerAddressByStashAddress, getNominators, getAccountDisplay,
//     ClassifyArg, ClassifyResult, classifyIdentify,
//     filterRepeatData,
//     compare
// } from "../../util"
// import { queryPledge } from "../pledge"
// import { queryMember } from "../member"
// import { } from "../../util"
// /**
//  * 通过验证人hash查询并返回ce_validator信息
//  *
//  * @export
//  * @param {string} validatorHash 验证人账户地址，stash地址
//  * @param {number} rank 验证人排名
//  * @param {ApiPromise} api
//  * @return {*}  {Promise<CeValidatorPledge>}
//  */
// export async function queryEras(
//     {
//         api,
//     }
//         : {
//             api: ApiPromise,
//         }
// ) {

//     // debugger;
//     let [overview, waitingValidatorAddress]: any = await Promise.all([
//         api.derive.staking.overview(),
//         api.derive.staking.waitingInfo()
//     ])

//     // const overview = await ;
//     // let waitingValidatorAddress: any = await ;
//     // debugger;
//     waitingValidatorAddress = waitingValidatorAddress.info.map((it: any) => {
//         return {
//             stashAddress: it.accountId.toJSON(),
//             controllerAddress: it.controllerId.toJSON()
//         }
//     });

//     // debugger;
//     // {activeEra,activeEraStart,currentEra,currentIndex,validatorCount,validators}
//     const activeEra: number = overview.activeEra.toJSON();
//     let rr = await api.query.staking.erasStartSessionIndex(activeEra)
//     let ii = await api.query.session.currentIndex()
//     console.log(rr.toJSON())
//     console.log(ii.toJSON())
//     // debugger;
//     const activeEraStart: number = (overview.activeEraStart.toJSON() as number) / 1000;
//     const validatorCount: number = overview.validatorCount.toJSON() as number;
//     const eraInfo: EraArg = {
//         activeEraStart,
//         activeEra,
//         validatorCount
//     }
//     const validatorAddresses: string[] = (overview.validators as any).toJSON() as string[];
//     /* 总数 = api.derive.staking.overview()返回的nextElected剔除验证人 + api.derive.staking.waitingInfo() */
//     const totalWaitingValidatorAddress = [];
//     /* 上边总数第一个 */
//     let filterWaitingValidator = overview.nextElected.map((it: any) => it.toJSON()).filter((item: any) => {
//         return !validatorAddresses.includes(item)
//     })
//     /* 查询每个候选验证人的控制账户地址 */
//     // debugger;
//     let addStashFilterWaitingValidator = (await getControllerAddressByStashAddress(filterWaitingValidator, api)).map((it: any, curIndex: number) => ({ stashAddress: filterWaitingValidator[curIndex], controllerAddress: it, }));
//     //添加
//     // debugger;
//     totalWaitingValidatorAddress.push(...waitingValidatorAddress)
//     totalWaitingValidatorAddress.push(...addStashFilterWaitingValidator);

//     false && (() => {
//         // debugger
//         // let arr = [];
//         // console.log(validatorAddresses, overview.nextElected.map((it: any) => it.toJSON()))
//         // let res = overview.nextElected.map((it: any) => it.toJSON()).filter((item: any) => {
//         //     return !validatorAddresses.includes(item)
//         // });
//         // let res2 = res.filter((item: any) => {
//         //     return !waitingValidatorAddress.find((it: any) => it.stashAddress === item)
//         // });
//         // console.log(res2)
//         // console.log(res)
//         // debugger;
//     })()

//     let targetWaitingValidator = totalWaitingValidatorAddress.map((hash: any, rank: number) => {
//         let validatorHash: any = hash.stashAddress;
//         return {
//             address: validatorHash,
//             rank,
//             role: 2,
//         }
//     })
//     let targetValidator = validatorAddresses.map((validatorHash: string, rank: number) => {
//         return {
//             address: validatorHash,
//             rank,
//             role: 1,
//         }
//     })
//     /* 查询验证人和候选验证人的质押信息 */
//     let pledgeAll = await queryPledge([...targetValidator, ...targetWaitingValidator], api, eraInfo);
//     let [validatorsNominators, waitingValidatorNominators]: { validatorAddress: string, nominators: any[] }[][] = await Promise.all([
//         getNominators(targetValidator.map(it => it.address), activeEra, api) as any,
//         getNominators(targetWaitingValidator.map(it => it.address), activeEra, api) as any
//     ]);
//     // debugger;
//     let totalNominators = [validatorsNominators, waitingValidatorNominators].map((iooo: any) => {
//         return iooo.map((it: any) => {
//             const totalBonded = it.nominators.map((ittttt: any) => ittttt.value).reduce((prev: number, cur: string) => {
//                 return prev + Number(cur);
//             }, 0)
//             let res = it.nominators.map((ittt: any, rank: number) => {
//                 // debugger;
//                 return {
//                     era: activeEra,
//                     nominatorRank: rank,
//                     bonded: Number(trillionCruFormat(ittt.value)),
//                     nominatorAddress: ittt.who,
//                     validatorAddress: it.validatorAddress,
//                     accountDisplay: "",//下边代码有加上
//                     quotient: Number(ittt.value) / totalBonded
//                 }
//             });
//             return res;
//         })

//     }).reduce((prev, cur) => [...prev, ...cur], []).reduce((prev: any[], cur: any[]) => [...prev, ...cur], []);
//     let nominatorAccountDisplays: any = await getAccountDisplay(totalNominators.map((it: any) => ({ address: it.nominatorAddress })), api);

//     totalNominators = totalNominators.map((it: any, curIndex: number) => ({ ...it, accountDisplay: JSON.stringify(nominatorAccountDisplays[curIndex]) }))
//     let validatorMapToMember = [targetValidator, targetWaitingValidator].map((it: any, tmpIndex: number) => {
//         // address: string,//存储账户，不能是控制账户
//         //     role: number,//1为验证人，2为候选验证人
//         //     rank: number
//         return it.map((item: any, curIndex: number) => {
//             let role: number = tmpIndex === 0 ? 1 : 2;
//             return {
//                 address: item.address,
//                 role,
//                 rank: item.rank
//             }
//         })
//     }).reduce((prev, cur) => [...prev, ...cur], []);
//     let filterRepeatNominator: any = [];
//     totalNominators.forEach((it: any) => {
//         // debugger;
//         if (!filterRepeatNominator.find((item: any) => item.nominatorAddress === it.nominatorAddress)) {
//             filterRepeatNominator.push(it);
//         }
//     });
//     let tmpTotalValidator = [...targetValidator, ...targetWaitingValidator]
//     let controllerAddress = await getControllerAddressByStashAddress(tmpTotalValidator.map(it => it.address), api)
//     let validatorMapToAccount = tmpTotalValidator.map((it: any, curIndex: number) => {
//         return [
//             {
//                 address: it.address,
//                 role: it.role,//1为验证人，2为候选验证人,3为提名人
//                 accountType: 1,
//             },
//             {
//                 address: controllerAddress[curIndex],
//                 role: it.role,//1为验证人，2为候选验证人,3为提名人
//                 accountType: 2,
//             },
//         ]
//     }).reduce((prev, cur) => [...prev, ...cur], []);
//     let nominatorControllerAddress: any = await getControllerAddressByStashAddress(filterRepeatNominator.map((it: any) => it.nominatorAddress), api);
//     let filterRepeatNominatorToAccount: any = filterRepeatNominator.map((it: any, curIndex: number) => {
//         return [{
//             address: it.nominatorAddress,
//             role: 3,
//             accountType: 1
//         }, {
//             address: nominatorControllerAddress[curIndex],
//             role: 3,
//             accountType: 2
//         }]
//     }).reduce((prev: any, cur: any) => [...prev, ...cur], []);

//     /* 获取议会成员，技术委员会成员，身份注册商成员 */
//     let [councilMembers, technicalCommittees, registrars]: any = await api.queryMulti([
//         [api.query.council.members],
//         [api.query.technicalCommittee.members],
//         [api.query.identity.registrars]
//     ])
//     councilMembers = councilMembers.toJSON();
//     technicalCommittees = technicalCommittees.toJSON();
//     registrars = registrars.toJSON().map((it: any) => it.account);
//     const stashClassifyArgs: ClassifyArg[] = [
//         {
//             data: councilMembers,
//             type: 'isCouncilMember'
//         },
//         {
//             data: technicalCommittees,
//             type: 'isTechcommMember'
//         },
//         {
//             data: registrars,
//             type: 'isRegistrar'
//         }
//     ]
//     let [councilMembersControllAddress, technicalCommitteesControllAddress, registrarsAddress] = await Promise.all([
//         getControllerAddressByStashAddress(councilMembers, api),
//         getControllerAddressByStashAddress(technicalCommittees, api),
//         getControllerAddressByStashAddress(registrars, api),
//     ]);

//     const controllClassifyArgs: ClassifyArg[] = [
//         {
//             data: councilMembersControllAddress,
//             type: 'isCouncilMember'
//         },
//         {
//             data: technicalCommitteesControllAddress,
//             type: 'isTechcommMember'
//         },
//         {
//             data: registrarsAddress,
//             type: 'isRegistrar'
//         }
//     ]
//     let stashClassifyResult: ClassifyResult[] = classifyIdentify(stashClassifyArgs);
//     let controllerClassifyResult: ClassifyResult[] = classifyIdentify(controllClassifyArgs);

//     let filterRepeatClassifyResult = stashClassifyResult.map(it => ({ ...it, accountType: 1 }));
//     controllerClassifyResult.forEach((item): any => {
//         if (!filterRepeatClassifyResult.find(it => it.data === item.data)) {
//             return {
//                 ...item,
//                 accountType: 2
//             }
//         }
//     });
//     const filterRepeatClassifyResultMapToAccount = filterRepeatClassifyResult.map(item => {
//         let identifyObj = item.type.reduce((prev, cur) => ({ ...prev, [cur]: 1 }), {})
//         return {
//             address: item.data,
//             accountType: item.accountType,//1为存储账户，2为控制账户
//             ...identifyObj
//             // isCouncilMember?: number,
//             // isEvmContract?: number,
//             // isRegistrar?: number,
//             // isTechcommMember?: number,
//         }
//     })

//     let allAccount = [...validatorMapToAccount, ...filterRepeatNominatorToAccount, ...filterRepeatClassifyResultMapToAccount]
//     // debugger;
//     /* 所有节点数 */
//     let nodes = await api.queryMulti([
//         ...(allAccount as any).filter((it: any) => it.accountType === 2).map((it: any) => [api.query.swork.groups, it.address])
//     ]).then(res => res.reduce((prev: any, cur: any) => [...prev, ...cur.toJSON()], []));
//     // nodes = filterRepeatData(nodes, [""]);//过滤掉重复的



//     // let tmpAA = await api.queryMulti([
//     //     ...(nodes as any).map((it: any) => [api.query.swork.groups, it])
//     // ]).then(res => res.reduce((prev: any, cur: any) => [...prev, ...cur.toJSON()], []));

//     // debugger;
//     nodes = nodes.map(it => {
//         return {
//             address: it,
//             accountType: 2,
//         }
//     })
//     // let tmpFilter = filterRepeatData;
//     // console.log(allAccount);
//     // debugger;
//     /* 过滤掉address和accountType重复的 */
//     allAccount = filterRepeatData([...allAccount, ...nodes], ["address", "accountType"]);
//     /* 过滤掉address一样，但是accountType不一样的，优先获取accountType=1 */
//     let filterRepeatAccount: any[] = [];
//     allAccount.forEach(item => {
//         let findData = filterRepeatAccount.find(it => it.address === item.address)
//         if (!findData) {
//             filterRepeatAccount.push(item);
//         } else {
//             /* 找到了，设置accountType为1 */
//             findData.accountType = 1;
//         }
//     })

//     // debugger;
//     /* 获取ce_account */
//     const accounts = await queryAccount(filterRepeatAccount, api)
//     // console.log(accounts)
//     // console.log(tmpFilter(accounts, ['address']))
//     // debugger;
//     // await api.query.swork.groups('5FgeE5xLr3f8Q11QeDrDtmr5nvzCrjdrTDDf1R1nsyfdLQVg');
//     /* 获取ce_member */
//     // debugger;
//     // const members = await queryMember([...validatorMapToMember, ...filterRepeatNominatorMapToMember], api, eraInfo)
//     const members = await queryMember(validatorMapToMember, api, eraInfo)
//     let res: EraResult = {
//         eraStat: {
//             era: activeEra,
//             startBlockTimestamp: activeEraStart,
//         },
//         bondedPledges: pledgeAll,//完成
//         members,
//         // validatorPledges: resValidators,
//         nominators: totalNominators,
//         accounts
//     };
//     // debugger;
//     return {
//         response: res,
//         realNominatorLen: filterRepeatNominator.length,
//         validatorLen: targetValidator.length,
//         waitingValidatorLen: targetWaitingValidator.length,

//     };






// }

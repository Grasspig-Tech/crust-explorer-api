



// // 入口
// import { ApiPromise } from '@polkadot/api';
// import { queryCeValidatorByValidatorHash } from "../validator"
// import { EraArg, Validator } from "../validator/interface"
// import { EraResult } from "./interface"
// import { queryAccount } from "../account"
// import { trillionCruFormat, getControllerAddressByStashAddress, getNominators, getAccountDisplay } from "../../util"
// import { queryPledge } from "../pledge"
// import { queryMember } from "../member"
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
//                     rank,
//                     bonded: Number(trillionCruFormat(ittt.value)),
//                     nominatorStash: ittt.who,
//                     validatorStash: it.validatorAddress,
//                     accountDisplay: "",
//                     quotient: Number(ittt.value) / totalBonded
//                 }
//             });
//             return res;
//         })

//     }).reduce((prev, cur) => [...prev, ...cur], []).reduce((prev: any[], cur: any[]) => [...prev, ...cur], []);
//     let nominatorAccountDisplays: any = await getAccountDisplay(totalNominators.map((it: any) => ({ address: it.nominatorStash })), api);

//     totalNominators = totalNominators.map((it: any, curIndex: number) => ({ ...it, accountDisplay: JSON.stringify(nominatorAccountDisplays[curIndex]) }))

//     // let totalValidatorNominators = validatorsNominators.map((it: any) => {
//     //     const totalBonded = it.nominators.map((ittttt: any) => ittttt.value).reduce((prev: number, cur: string) => {
//     //         return prev + Number(cur);
//     //     }, 0)
//     //     let res = it.nominators.map((ittt: any, rank: number) => {
//     //         // debugger;
//     //         return {
//     //             era: activeEra,
//     //             rankNominator: rank,
//     //             bonded: trillionCruFormat(ittt.value),
//     //             nominatorStash: ittt.who,
//     //             validatorStash: it.validatorAddress,
//     //             accountDisplay: "",
//     //             quotient: String(Number(ittt.value) / totalBonded)
//     //         }
//     //     });
//     //     return res;
//     // }).reduce((prev, cur) => {
//     //     return [...prev, ...cur]
//     // }, []);
//     // let totalWaitingValidatorNominators = waitingValidatorNominators.map((it: any) => {
//     //     const totalBonded = it.nominators.map((ittttt: any) => ittttt.value).reduce((prev: number, cur: string) => {
//     //         return prev + Number(cur);
//     //     }, 0)
//     //     let res = it.nominators.map((ittt: any, rank: number) => {
//     //         // debugger;
//     //         return {
//     //             era: activeEra,
//     //             rankNominator: rank,
//     //             bonded: trillionCruFormat(ittt.value),
//     //             nominatorStash: ittt.who,
//     //             validatorStash: it.validatorAddress,
//     //             accountDisplay: "",
//     //             quotient: String(Number(ittt.value) / totalBonded)
//     //         }
//     //     });
//     //     return res;
//     // }).reduce((prev, cur) => {
//     //     return [...prev, ...cur]
//     // }, []);
//     // let totalNominators =
//     /* 给提名人添加accountDisplay字段，注意这里不能去重 */
//     // let [validatorNominatorAccountDisplays, waitingValidatorNominatorAccountDisplays]: any = await Promise.all([
//     //     await getAccountDisplay(totalValidatorNominators.map((it: any) => it.nominatorStash), api),
//     //     await getAccountDisplay(totalWaitingValidatorNominators.map((it: any) => it.nominatorStash), api),
//     // ]);
//     // totalValidatorNominators = totalValidatorNominators.map((it: any, curIndex: number) => ({ ...it, accountDisplay: validatorNominatorAccountDisplays[curIndex] }))
//     // totalWaitingValidatorNominators = totalWaitingValidatorNominators.map((it: any, curIndex: number) => ({ ...it, accountDisplay: waitingValidatorNominatorAccountDisplays[curIndex] }))
//     // let totalValidatorNominators: { who: string, value: string | number }[] = nominators.reduce((prev, cur) => [...prev, ...cur], []);
//     // let validatorAll = targetValidator.map(it => {
//     //     return queryCeValidatorByValidatorHash({ ...it, api })
//     // })
//     // let waitingValidatorAll = targetWaitingValidator.map((it: any) => {
//     //     return queryCeValidatorByValidatorHash({ ...it, api })
//     // })
//     // let validators: Validator[] = await Promise.all([...validatorAll, ...waitingValidatorAll]);
//     // const resValidators = validators.map(it => it.validator)

//     // let nominators = validators.map((it) => {
//     //     const item = it.nomimators;
//     //     const totalBonded = item.map(ittttt => ittttt.value).reduce((prev: number, cur: string) => {
//     //         return prev + Number(cur);
//     //     }, 0)
//     //     let res = item.map((ittt, rank) => {
//     //         // debugger;
//     //         return {
//     //             era: activeEra,
//     //             rankNominator: rank,
//     //             bonded: trillionCruFormat(ittt.value),
//     //             nominatorStash: ittt.who,
//     //             validatorStash: it.validator.accountAddress,
//     //             accountDisplay: "",
//     //             quotient: String(Number(ittt.value) / totalBonded)
//     //         }
//     //     });
//     //     return res;
//     // }).reduce((prev, cur) => {
//     //     return [...prev, ...cur]
//     // }, []);
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
//         if (!filterRepeatNominator.find((item: any) => item.nominatorStash === it.nominatorStash)) {
//             filterRepeatNominator.push(it);
//         }
//     });
//     let filterRepeatNominatorMapToMember = filterRepeatNominator.map((it: any, curIndex: number) => {
//         return {
//             address: it.nominatorStash,
//             role: 3,
//             rank: it.rank
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
//     // let nominatorControllerAddress: any = await getControllerAddressByStashAddress(filterRepeatNominator.map((it: any) => it.nominatorAddress), api)
//     // let nominatorToAccount = filterRepeatNominator.map((it: any, curIndex: number) => {
//     //     return [
//     //         {
//     //             address: it.address,
//     //             role: 3,//1为验证人，2为候选验证人,3为提名人
//     //             accountType: 1,
//     //         },
//     //         {
//     //             address: controllerAddress[curIndex],
//     //             role: 3,//1为验证人，2为候选验证人,3为提名人
//     //             accountType: 2,
//     //         },
//     //     ]
//     // })
//     // let validatorMapToAccount = [...targetWaitingValidator, ...targetValidator].map((it: any) => {
//     //     return [
//     //         {
//     //             address: it.validator.accountAddress,
//     //             role: it.validator.role,//1为验证人，2为候选验证人,3为提名人
//     //             accountType: 1,
//     //         },
//     //         {
//     //             address: it.validator.controllerAccountAddress,
//     //             role: it.validator.role,//1为验证人，2为候选验证人,3为提名人
//     //             accountType: 2,
//     //         },
//     //     ]
//     // }).reduce((prev, cur) => [...prev, ...cur], []);
//     // if (false && validatorMapToAccount.findIndex((it, curIndex) => validatorMapToAccount.find((item: any, i: number): any => { if (curIndex !== i && it.address === item.address && it.accountType === item.accountType) { console.log(curIndex, i); return true; } })) !== -1) {
//     //     // debugger;
//     // }
//     // let filterRepeatNominator: any = [];
//     // totalNominators.forEach((it: any) => {
//     //     // debugger;
//     //     if (!filterRepeatNominator.find((item: any) => item.nominatorStash === it.nominatorStash)) {
//     //         filterRepeatNominator.push(it);
//     //     }
//     // });
//     // debugger;
//     let nominatorControllerAddress: any = await getControllerAddressByStashAddress(filterRepeatNominator.map((it: any) => it.nominatorStash), api);
//     let filterRepeatNominatorToAccount: any = filterRepeatNominator.map((it: any, curIndex: number) => {
//         return [{
//             address: it.nominatorStash,
//             role: 3,
//             accountType: 1
//         }, {
//             address: nominatorControllerAddress[curIndex],
//             role: 3,
//             accountType: 2
//         }]
//     }).reduce((prev: any, cur: any) => [...prev, ...cur], []);
//     // if (false && filterRepeatNominatorToAccount.findIndex((it: any, curIndex: number) => filterRepeatNominatorToAccount.find((item: any, i: number): any => { if (curIndex !== i && it.address === item.address && it.accountType === item.accountType) { console.log(curIndex, i); return true; } })) !== -1) {
//     //     // debugger;
//     // }

//     // let waitingValidatorAddressToAccount = totalWaitingValidatorAddress.map((it: any) => [{ address: it.stashAddress, role: 2, accountType: 1 }, { address: it.controllerAddress, role: 2, accountType: 2 }]).reduce((prev: any, cur: any) => [...prev, ...cur], [])
//     // let tmp: any = [...validatorMapToAccount, ...filterRepeatNominatorToAccount, ...waitingValidatorAddressToAccount]
//     // if (tmp.findIndex((it: any, curIndex: number) => tmp.find((item: any, i: number): any => { if (curIndex !== i && it.address === item.address && it.accountType === item.accountType) { console.log(curIndex, i); return true; } })) !== -1) {
//     //     debugger;
//     // }
//     // await queryMember(era)

//     /* 获取ce_account */
//     const accounts = await queryAccount([...validatorMapToAccount, ...filterRepeatNominatorToAccount], api)
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
//     debugger;
//     return res;






// }

// // 入口
// import { ApiPromise } from '@polkadot/api';
// import { ResultInfo } from '../../interface';
// import { CeValidatorPledge } from "../../model/ce_validator_pledge"
// import { RegistrationJudgement } from "@polkadot/types/interfaces"
// import { EraArg, Validator } from "../validator/interface"
// import { EraResult } from "../era/interface"
// import { trillionCruFormat } from "../../util"
// import { CeMember } from "../../model/ce_member"
// import { getAccountDisplay } from "../../util"

// /**
//  * 
//  * @param param0 
//  * @returns 
//  */
// export async function queryMember(
//     accounts
//         : {
//             address: string,//存储账户，不能是控制账户
//             role: number,//1为验证人，2为候选验证人
//             rank: number
//         }[],
//     api: ApiPromise,
//     eraInfo: EraArg,
// ): Promise<CeMember[]> {
//     let pAll = accounts.map(it => {
//         return queryOneMember(it, api, eraInfo);
//     })
//     try {
//         let ceMemberList = await Promise.all(pAll)
//         return ceMemberList;
//     } catch (error) {
//         throw new Error(error)
//     }
// }
// export async function queryOneMember(
//     {
//         address,
//         role,
//         rank
//     }: {
//         address: string,
//         role: number,//1为验证人，2为候选验证人
//         rank: number
//     },
//     api: ApiPromise,
//     eraInfo: EraArg
// ): Promise<CeMember> {

//     return ceMember;


// }


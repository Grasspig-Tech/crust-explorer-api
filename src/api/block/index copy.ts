// import grantWs from "../grant-ws"
// import { ApiPromise } from "@polkadot/api"
// import { CeBlock } from "../../model/ce_block"
// import { CeEvent } from "../../model/ce_event"
// import { CeTransfer } from "../../model/ce_transfer"
// import { CeExtrinsic } from "../../model/ce_extrinsic"
// import { CONFIRM_BLOCK } from "../../config"
// import { Block } from "./interface/block"
// import { removeDot, ms2S, trillionCruFormat } from "../../util"
// import logger from "../../util/logger"
// import { CeRewardSlash } from "../../model/ce_reward_slash"
// import { Extrinsic, TransactionInfo, EventRecord } from "@polkadot/types/interfaces"
// import { isExtrinsicSuccess } from "./util"

// import { getAccountDisplay, getSortIndex, getBlockTimestamp } from "../../util"

// /**
//  * 获取完整的区块信息，包括区块头，事件，交易，转账
//  *
//  * @export
//  * @param {number} blockNum
//  * @return {*} 
//  */
// export async function queryOneBlockByBlockNum(blockNum: number, api: ApiPromise): Promise<Block> {
//     // const api = grantWs.api;
//     try {
//         // debugger;
//         // debugger;
//         let blockHash: string = String((await api?.rpc.chain.getBlockHash(blockNum))?.toHuman());
//         if (!blockHash) {
//             logger.error(`不存在区块高度为${blockNum}的区块`);
//             console.error(`不存在区块高度为${blockNum}的区块`)
//             throw new Error(`不存在区块高度为${blockNum}的区块`)
//         }
//         // let { block } = (await api?.rpc.chain.getBlock(blockHash) as any)?.block
//         // let {
//         //     block,
//         //     author,
//         //     extrinsics//交易列表

//         // }: any = await api?.rpc.chain.getBlock(blockHash);
//         let block: any;
//         let extrinsics: any = [];
//         let events = [];
//         let author = "";
//         try {
//             /* placeholder是占位的，因为api?.derive.chain.getBlock(blockHash)报错会导致死循环 */
//             let [placeholder, blockInfo]: any = await Promise.all([
//                 api?.rpc.chain.getBlock(blockHash),
//                 api?.derive.chain.getBlock(blockHash)
//             ])
//             // let { events, block: { block } }: any = await api?.derive.tx.events(blockHash as any);
//             // debugger;
//             // let blockInfo: any = await api?.derive.chain.getBlock;
//             // let blockInfo: any = await api?.derive.chain.getBlock(blockHash).catch(err => { throw err });
//             // // console.log("?????????????")
//             // debugger;
//             block = blockInfo.block;
//             events = blockInfo.events;
//             extrinsics = blockInfo.extrinsics;
//             // debugger;
//             author = blockInfo.author.toHuman();
//         } catch (error) {
//             logger.error(error);
//             console.error(error)
//         }
//         // debugger;
//         // let { extrinsics } = block;
//         let blockHeader = block?.header?.toHuman();//区块头信息
//         blockHeader = blockHeader ? blockHeader : {}
//         // author =  author.toHuman();//验证人地址
//         // author = (author as any)?.toHuman();//验证人地址
//         let specVersion = Number(api?.consts.system.version.toHuman().specVersion);//运行时版本
//         const { parentHash, stateRoot, extrinsicsRoot }: any = blockHeader;
//         let [lastFinalizedBlockHash, authorInfo] = await Promise.all([
//             api?.rpc.chain.getFinalizedHead().then(res => res.toHuman()),
//             api.derive.accounts.info(author)
//         ])
//         const accountDisplay = (await getAccountDisplay([{ address: author }], api))[0];
//         // const accountDisplay = {
//         //     address: author,
//         //     ...JSON.parse(JSON.stringify(authorInfo.identity))
//         // }
//         // let lastFinalizedBlockHash = (await api?.rpc.chain.getFinalizedHead())?.toHuman();//最新确认区块哈希
//         let finalizedBlock = await api?.rpc.chain.getBlock(lastFinalizedBlockHash as string)
//         let lastBlockNum: any = finalizedBlock?.block.header.number.toJSON();
//         // let lastBlockNum: any = (await api?.rpc.chain.getBlock(lastFinalizedBlockHash as string))?.block.header.number.toJSON()//最新确认区块高度
//         let finalized: number;
//         // debugger;
//         let blockTimestamp: number = await getBlockTimestamp(extrinsics, 3, api);
//         // debugger;
//         // let blockTimestamp: number = 0;

//         // debugger;
//         // extrinsics.find((it: any): any => {
//         //     /* 获取blockTimestamp */
//         //     // debugger;
//         //     // const extrinsicItem = JSON.parse(it.extrinsic.toString());
//         //     // args: ['1,625,789,262,000'] , method:'set' , section:'timestamp'
//         //     const { method: { section, method, args } } = it.extrinsic.toHuman();
//         //     if (section === 'timestamp' && method === 'set') {
//         //         // extract the Option<Moment> as Moment
//         //         blockTimestamp = ms2S(removeDot(args[0]));
//         //         // debugger;
//         //         return true;
//         //     }
//         // })
//         if (lastBlockNum - blockNum < CONFIRM_BLOCK) {
//             /* 确认中 */
//             finalized = 0;
//         } else {
//             /* 已确认 */
//             finalized = 1;
//         }
//         /* ce_block信息 */
//         const ceBlock: CeBlock = {
//             finalized,
//             blockNum,
//             blockTimestamp,
//             hash: blockHash,
//             parentHash,
//             eventCount: events.length,
//             extrinsicsCount: extrinsics.length,
//             stateRoot,
//             extrinsicsRoot,
//             specVersion,
//             validator: author,
//             accountDisplay: JSON.stringify(accountDisplay)
//         }
//         /* ce_extrinsic列表 */
//         // debugger;
//         const ceExtrinsicLists: CeExtrinsic[] = extrinsics.map((item: any, curIndex: number): CeExtrinsic => {
//             // debugger;

//             const extrinsicFinalized: number = isExtrinsicSuccess(item, api);
//             let it: Extrinsic = item.extrinsic;
//             // api.events.system.ExtrinsicFailed.is()
//             /* args: [{name: 'curr_pk', type: 'SworkerPubKey'},...] */
//             const args: any = it.meta.args.toHuman();
//             /* argsValues对应args的值 */
//             const argsValues = it.args.map((it: any) => it.toHuman());
//             const params = JSON.stringify(args?.map((it: any, curIndex: number) => ({ ...it, value: argsValues[curIndex] })));
//             // debugger;
//             const txToHuman: any = it.toHuman();
//             const txToJSON: Extrinsic = JSON.parse(it.toString());
//             const { method } = txToJSON;
//             const { method: callModuleFunction, section: callModule } = txToHuman.method;
//             const { signature = "", signer = "", nonce = 0, isSigned = 0 } = txToHuman;
//             const ceExtrinsic: CeExtrinsic = {
//                 extrinsicSort: getSortIndex(`${blockNum}-${curIndex}`),
//                 lifetime: callModule === 'timestamp' ? '' : JSON.stringify({ birth: blockNum - 4, death: blockNum + 60 }),
//                 params,
//                 extrinsicIdx: curIndex,
//                 extrinsicIndex: `${blockNum}-${curIndex}`,
//                 extrinsicHash: it.hash.toHuman() as string,
//                 blockHash,
//                 blockNum,
//                 blockTimestamp,
//                 callModule,
//                 callModuleFunction,
//                 accountId: signer,
//                 accountDisplay: JSON.stringify(accountDisplay),
//                 fee: '0',
//                 finalized,
//                 signed: isSigned ? 1 : 0,
//                 nonce: removeDot(nonce),
//                 signature,
//                 transfer: "",
//                 success: extrinsicFinalized

//             }
//             return ceExtrinsic;
//         })
//         /* ce_events列表 */
//         // debugger;
//         const ceEventLists: CeEvent[] = events.map((it: any, curIndex: number): CeEvent => {
//             /* 
//                 {
//                     event:{
//                         data: [{
//                             class: "Mandatory"
//                             paysFee: "Yes"
//                             weight: "161,338,000"
//                         }]
//                         0: {weight: "161,338,000", class: "Mandatory", paysFee: "Yes"}
//                         length: 1
//                         __proto__: Array(0)
//                         index: "0x0000"
//                         method: "ExtrinsicSuccess"
//                         section: "system"

//                         data:(2) ['5EEmQjwhKA45ZUfYCdy8UPQUzCgvQaRwx3tvmN6AdU4W7wxD', '0x4cff15c7ac41d48288d283abb0f4a813d275e7f85fe2480…add9ee844815cea2c676151a9c94b8e4b728c126f9e8f2dd']
//                         index:'0x1a01'
//                         method:'WorksReportSuccess'
//                         section:'swork'
//                     }
//                     phase: {
//                         ApplyExtrinsic: "0"
//                     }
//                     topics: []
//                 }
//             */
//             // debugger;
//             // debugger;
//             // debugger;
//             const { hash } = it;
//             const { meta, data } = it.event;
//             it = it.toHuman();
//             const { event, phase, topics } = it;
//             // console.log('-------------')
//             const { method, section } = event;
//             const { ApplyExtrinsic, asApplyExtrinsic } = phase;
//             let allpyExtrinsicIndex = asApplyExtrinsic != undefined ? asApplyExtrinsic : ApplyExtrinsic;
//             // console.log(allpyExtrinsicIndex)
//             // debugger;
//             const args = meta.args.toHuman();//['AccountId', 'SworkerPubKey']
//             const argsValue = data.toHuman();//['5EWKQc9fNccv4WrLrNXS6DHqNQHG4F6b1MhnGsvU5VhqbMmz', '0xf580f355209251658531afec798a93985906e8c8eceb36b…e947a5f7679b3ae0d8555060d3fdb6595e13391478cfda01']
//             const params = JSON.stringify(args.map((it: any, curIndex: number) => ({ type: it, value: argsValue[curIndex] })))
//             let extrinsicHash = extrinsics[allpyExtrinsicIndex]?.extrinsic.hash.toHuman();
//             // console.log(`对应${allpyExtrinsicIndex}交易，交易哈希为：${extrinsicHash}`)
//             // console.log(`对应${allpyExtrinsicIndex}交易，交易哈希为：${ceExtrinsicLists[allpyExtrinsicIndex].extrinsicHash}`)
//             // console.log('-------------')
//             extrinsicHash = extrinsicHash ? extrinsicHash : "";
//             let extrinsicIndex = ceExtrinsicLists[allpyExtrinsicIndex]?.extrinsicIndex;
//             extrinsicIndex = extrinsicIndex ? extrinsicIndex : "";
//             let success = allpyExtrinsicIndex == undefined ? 1 : ceExtrinsicLists[allpyExtrinsicIndex]?.success;
//             let extrinsicIdx = Number(allpyExtrinsicIndex);
//             if (extrinsicIdx !== 0 && !extrinsicIdx) {
//                 extrinsicIdx = -1;
//             }
//             // api.events.system.ExtrinsicFailed.is()
//             // debugger;
//             const eventItem: CeEvent = {
//                 // eventHash: hash.toHuman(),
//                 eventSort: getSortIndex(`${blockNum}-${curIndex}`),
//                 blockNum,
//                 blockTimestamp,
//                 eventId: method,
//                 eventIdx: curIndex,
//                 eventIndex: `${blockNum}-${curIndex}`,
//                 extrinsicHash,
//                 extrinsicIndex,
//                 extrinsicIdx,
//                 finalized,
//                 type: "",
//                 moduleId: section,
//                 params,
//                 success
//             }
//             return eventItem;
//         })
//         // ceExtrinsicLists.forEach(it => {
//         //     console.log(it.extrinsicHash)
//         // })

//         /* ce_transfer列表 */
//         // debugger;
//         const ceTransferLists: CeTransfer[] = events.map((it: any, curIndex: number): CeTransfer | null => {
//             if (it.event.method !== "Transfer") {
//                 /* 过滤掉非转账的事件 */
//                 return null;
//             }

//             // debugger;
//             // const transferToJson = JSON.parse(it.toString());
//             // debugger;
//             const { event, hash, phase, topics } = it;
//             // console.log(hash.toHuman());
//             let { method, section } = event;
//             let data = it.event.toJSON().data;
//             const [from, to, amount] = data;
//             const { asApplyExtrinsic, ApplyExtrinsic } = phase;
//             let allpyExtrinsicIndex = asApplyExtrinsic != undefined ? asApplyExtrinsic : ApplyExtrinsic;
//             // debugger;
//             const ceTransfer: CeTransfer = {
//                 amount: trillionCruFormat(amount),//返回的是720136800,subscan显示的是0.0007201368   0.000720
//                 asset_symbol: "",
//                 eventIndex: `${blockNum}-${curIndex}`,
//                 // eventHash: hash.toHuman(),
//                 extrinsicIndex: `${ceExtrinsicLists[allpyExtrinsicIndex].extrinsicIndex}`,
//                 hash: `${ceExtrinsicLists[allpyExtrinsicIndex].extrinsicHash}`,
//                 blockNum,
//                 blockTimestamp,
//                 module: section,
//                 from,
//                 to,
//                 fee: '0',
//                 nonce: 0,
//                 finalized,
//                 eventSort: getSortIndex(`${blockNum}-${curIndex}`),
//                 success: ceExtrinsicLists[allpyExtrinsicIndex].success
//             }
//             return ceTransfer;
//         }).filter((it: any) => it) as CeTransfer[];
//         /* ce_reward_slash列表 */
//         // debugger;
//         const ceRewardSlashLists: CeRewardSlash[] = events.map((it: any, curIndex: number): CeRewardSlash | null => {
//             // debugger;
//             if (!["Reward", "Slash"].includes(it.event.method)) {
//                 /* 过滤掉非奖励和惩罚的事件 */
//                 return null;
//             }
//             // const it: EventRecord = item;
//             // debugger;
//             const { event, hash, phase, topics } = it;
//             let { method, section, meta, data } = event;
//             let dataData = it.event.toJSON().data;
//             const [accountId, amount]: any = dataData;
//             const asApplyExtrinsic = phase.asApplyExtrinsic.toHuman();
//             // console.log(asApplyExtrinsic);
//             // debugger;
//             const args: string[] = meta.args.toHuman() as string[];//['AccountId', 'SworkerPubKey']
//             const argsValue: string[] = data.toHuman() as string[];//['5EWKQc9fNccv4WrLrNXS6DHqNQHG4F6b1MhnGsvU5VhqbMmz', '0xf580f355209251658531afec798a93985906e8c8eceb36b…e947a5f7679b3ae0d8555060d3fdb6595e13391478cfda01']
//             const params = JSON.stringify(args.map((it: any, curIndex: number) => ({ type: it, value: argsValue[curIndex] })))
//             let result: CeRewardSlash = {
//                 params,
//                 extrinsicIdx: ceExtrinsicLists[asApplyExtrinsic].extrinsicIdx,
//                 extrinsicHash: `${ceExtrinsicLists[asApplyExtrinsic].extrinsicHash}`,
//                 blockNum,
//                 blockTimestamp,
//                 eventId: method,
//                 eventIdx: curIndex,
//                 eventIndex: `${blockNum}-${curIndex}`,
//                 // eventHash: hash.toHuman(),
//                 validatorStash: author,
//                 accountId,
//                 moduleId: section,
//                 amount: trillionCruFormat(amount),
//                 eventSort: getSortIndex(`${blockNum}-${curIndex}`),
//                 success: ceExtrinsicLists[asApplyExtrinsic].success,
//                 finalized
//             };
//             return result;
//         }).filter((it: any) => it) as CeRewardSlash[];
//         // debugger;

//         const resBlock: Block = {
//             ...ceBlock,
//             events: ceEventLists,
//             extrinsics: ceExtrinsicLists,
//             transfers: ceTransferLists,
//             rewardSlashes: ceRewardSlashLists
//         }
//         return resBlock;
//     } catch (error) {
//         console.log(`${blockNum}区块报错`)
//         console.log(error)
//         throw new Error(`${blockNum}区块报错`)
//     }
// }



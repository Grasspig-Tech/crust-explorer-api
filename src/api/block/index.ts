import {ApiPromise} from '@polkadot/api';
import CrustPool from '../../crust-pool';
import {
  CeBlock,
  CeEvent,
  CeTransfer,
  CeExtrinsic,
  CeRewardSlash,
} from '../../model';
import {CONFIRM_BLOCK} from '../../config';
import {Block, Status} from '../../interface';
import {
  removeDot,
  trillionCruFormat,
  isExtrinsicSuccess,
  getAccountDisplay,
  getSortIndex,
  getBlockTimestamp,
} from '../../util';
import {Extrinsic} from '@polkadot/types/interfaces';

/**
 * 获取完整的区块信息，包括区块头，事件，交易，转账
 *
 * @export
 * @param {number} blockNum
 * @return {*}
 */
export async function queryOneBlockByBlockNum(
  blockNum: number
): Promise<Block> {
  try {
    const blockHash = String(
      (
        await CrustPool.Run<any>((api: ApiPromise) => {
          return api.rpc.chain.getBlockHash(blockNum);
        })
      )?.toHuman()
    );
    if (!blockHash) {
      throw `not find ${blockNum} block`;
    }
    let block: any;
    let extrinsics: any = [];
    let events = [];
    let author = '';
    try {
      /* placeholder是占位的，因为api?.derive.chain.getBlock(blockHash)报错会导致死循环 */
      const [blockInfo]: any[] = await Promise.all([
        CrustPool.Run<any>((api: ApiPromise) => {
          return api.derive.chain.getBlock(blockHash);
        }),
        CrustPool.Run<any>((api: ApiPromise) => {
          return api.rpc.chain.getBlock(blockHash);
        }),
      ]);
      // const blockInfo: any = await CrustPool.Run<any>((api: ApiPromise) => {
      //   return api.rpc.chain.getBlock(blockHash);
      // });
      block = blockInfo.block;
      events = blockInfo.events;
      extrinsics = blockInfo.extrinsics;
      author = blockInfo.author?.toHuman();
    } catch (error) {
      throw `${blockNum} info not find`;
    }

    let blockHeader = block?.header?.toHuman(); // 区块头信息
    blockHeader = blockHeader || {};
    const {
      parentHash,
      stateRoot,
      extrinsicsRoot,
    }: {parentHash: string; stateRoot: string; extrinsicsRoot: string} =
      blockHeader;

    /*
            lastFinalizedBlockHash: 最新确认区块哈希
            authorInfo: 验证人的信息
            specVersion: 运行时版本
        */
    const [lastFinalizedBlockHash, specVersion] = await Promise.all([
      CrustPool.Run<any>((api: ApiPromise) => {
        return api.rpc.chain.getFinalizedHead();
      }).then((res: any) => res.toHuman()),
      CrustPool.Run<any>((api: ApiPromise) => {
        return api.rpc.state.getRuntimeVersion(blockHash);
      }).then((res: any) => Number(res?.toJSON().specVersion)),
    ]);
    const accountDisplay = (await getAccountDisplay([{address: author}]))[0];
    const finalizedBlock: any = await CrustPool.Run<any>((api: ApiPromise) => {
      return api.rpc.chain.getBlock(lastFinalizedBlockHash as string);
    });
    const lastBlockNum: any = finalizedBlock?.block.header.number?.toJSON();
    let finalized: Status;

    const blockTimestamp: number = await getBlockTimestamp(extrinsics, 3);

    if (lastBlockNum - blockNum < CONFIRM_BLOCK) {
      /* 确认中 */
      finalized = Status.No;
    } else {
      /* 已确认 */
      finalized = Status.Yes;
    }
    /* ce_block信息 */
    const ceBlock: CeBlock = {
      finalized,
      blockNum,
      blockTimestamp,
      hash: blockHash,
      parentHash,
      eventCount: events.length,
      extrinsicsCount: extrinsics.length,
      stateRoot,
      extrinsicsRoot,
      specVersion,
      validator: author,
      accountDisplay: JSON.stringify(accountDisplay),
    };
    /* ce_extrinsic列表 */

    const ceExtrinsicLists: CeExtrinsic[] = await Promise.all(
      extrinsics.map(
        async (item: any, curIndex: number): Promise<CeExtrinsic> => {
          const extrinsicFinalized: Status = await CrustPool.Run<any>(
            (api: ApiPromise) => {
              return Promise.resolve(isExtrinsicSuccess(item, api));
            }
          );
          const it: Extrinsic = item.extrinsic;
          // api.events.system.ExtrinsicFailed.is()
          /* args: [{name: 'curr_pk', type: 'SworkerPubKey'},...] */
          const args: any = it.meta.args.toHuman();
          /* argsValues对应args的值 */
          // const argsValues = it.args.map((it: any) => it.toHuman());
          const argsValues = it.args.map((it: any) => it?.toJSON());

          const params = args?.map((it: any, curIndex: number) => ({
            ...it,
            value: argsValues[curIndex],
          }));

          const txToHuman: any = it.toHuman();
          const {method: callModuleFunction, section: callModule} =
            txToHuman.method;
          const {
            signature = '',
            signer = '',
            nonce = 0,
            isSigned = 0,
          } = txToHuman;

          // let transfer = callModule === 'balances' ? params.find((it: { name: string, type: string, value: string }) => it.name === 'dest')?.value : '';
          // transfer = transfer ? transfer : '';

          const ceExtrinsic: CeExtrinsic = {
            extrinsicSort: getSortIndex(`${blockNum}-${curIndex}`),
            lifetime:
              callModule === 'timestamp'
                ? ''
                : JSON.stringify({birth: blockNum - 4, death: blockNum + 60}),
            params: JSON.stringify(params),
            extrinsicIdx: curIndex,
            extrinsicIndex: `${blockNum}-${curIndex}`,
            extrinsicHash: it.hash.toHuman() as string,
            blockHash,
            blockNum,
            blockTimestamp,
            callModule,
            callModuleFunction,
            accountId: signer,
            accountDisplay: '', // 下边会统一获取
            fee: '0',
            finalized,
            signed: isSigned ? Status.Yes : Status.No,
            nonce: removeDot(nonce),
            signature,
            transfer: '', // 下边会统一获取
            success: extrinsicFinalized,
          };
          return ceExtrinsic;
        }
      )
    );
    /*
            统一获取extrinsic中transfer字段
                transfer: {from,to,amount,toAccountDisplay}
                暂时发现subscan的交易中callModule为balances  且callModuleFunction为transferKeepAlive或transfer
                    才有transfer字段
        */
    const ceExtrinsicListParams: Array<{
      to: string;
      amount: number;
      index: number;
      from: string;
    }> = ceExtrinsicLists
      .map((it, index) => {
        return {
          from: it.accountId,
          params: JSON.parse(it.params),
          index,
          callModule: it.callModule,
          callModuleFunction: it.callModuleFunction,
        };
      })
      .filter(
        it =>
          it.callModule === 'balances' &&
          ['transferKeepAlive', 'transfer'].includes(it.callModuleFunction)
      )
      .map(it => {
        return {
          from: it.from,
          to: it.params.find(
            (it: {name: string; type: string; value: string}) =>
              it.name === 'dest'
          )?.value,
          amount: it.params.find(
            (it: {name: string; type: string; value: string}) =>
              it.name === 'value'
          )?.value,
          index: it.index,
        };
      });
    /* 统一获取extrinsic中transfer里的to对应的accountDisplay */
    const toAccountDisplays = await getAccountDisplay(
      ceExtrinsicListParams.map(it => ({address: it.to}))
    );
    ceExtrinsicListParams.forEach((it, curIndex) => {
      const targetTransfer: {
        from: string;
        to: string;
        amount: string;
        toAccountDisplay: string;
      } = {
        from: it.from,
        to: it.to,
        amount: trillionCruFormat(it.amount),
        toAccountDisplay: JSON.stringify(toAccountDisplays[curIndex]),
      };
      ceExtrinsicLists[it.index].transfer = JSON.stringify(targetTransfer);
    });

    /* 统一获取extrinsic中accountId对应的accountDisplay */
    const extrinsicAccountDisplays = await getAccountDisplay(
      ceExtrinsicLists.map(it => ({address: it.accountId}))
    );
    ceExtrinsicLists.forEach((item, index: number) => {
      item.accountDisplay = JSON.stringify(extrinsicAccountDisplays[index]);
    });
    /* ce_events列表 */

    const ceEventLists: CeEvent[] = events.map(
      (it: any, curIndex: number): CeEvent => {
        /*
                {
                    event:{
                        data: [{
                            class: "Mandatory"
                            paysFee: "Yes"
                            weight: "161,338,000"
                        }]
                        0: {weight: "161,338,000", class: "Mandatory", paysFee: "Yes"}
                        length: 1
                        __proto__: Array(0)
                        index: "0x0000"
                        method: "ExtrinsicSuccess"
                        section: "system"

                        data:(2) ['5EEmQjwhKA45ZUfYCdy8UPQUzCgvQaRwx3tvmN6AdU4W7wxD', '0x4cff15c7ac41d48288d283abb0f4a813d275e7f85fe2480…add9ee844815cea2c676151a9c94b8e4b728c126f9e8f2dd']
                        index:'0x1a01'
                        method:'WorksReportSuccess'
                        section:'swork'
                    }
                    phase: {
                        ApplyExtrinsic: "0"
                    }
                    topics: []
                }
            */

        // const {hash} = it;
        const {meta, data} = it.event;
        it = it.toHuman();
        const {event, phase} = it;
        const {method, section} = event;
        const {ApplyExtrinsic, asApplyExtrinsic} = phase;
        const allpyExtrinsicIndex =
          asApplyExtrinsic !== undefined ? asApplyExtrinsic : ApplyExtrinsic;

        const args = meta.args.toHuman();
        const argsValue = data.toHuman();
        const params = JSON.stringify(
          args.map((it: any, curIndex: number) => ({
            type: it,
            value: argsValue[curIndex],
          }))
        );
        let extrinsicHash =
          extrinsics[allpyExtrinsicIndex]?.extrinsic.hash.toHuman();
        extrinsicHash = extrinsicHash || '';
        let extrinsicIndex =
          ceExtrinsicLists[allpyExtrinsicIndex]?.extrinsicIndex;
        extrinsicIndex = extrinsicIndex || '';
        const success: Status =
          allpyExtrinsicIndex === undefined
            ? Status.Yes
            : ceExtrinsicLists[allpyExtrinsicIndex]?.success;
        let extrinsicIdx = Number(allpyExtrinsicIndex);
        if (extrinsicIdx !== 0 && !extrinsicIdx) {
          extrinsicIdx = -1;
        }
        // api.events.system.ExtrinsicFailed.is()

        const eventItem: CeEvent = {
          // eventHash: hash.toHuman(),
          eventSort: getSortIndex(`${blockNum}-${curIndex}`),
          blockNum,
          blockTimestamp,
          eventId: method,
          eventIdx: curIndex,
          eventIndex: `${blockNum}-${curIndex}`,
          extrinsicHash,
          extrinsicIndex,
          extrinsicIdx,
          finalized,
          type: '',
          moduleId: section,
          params,
          success,
        };
        return eventItem;
      }
    );
    /* ce_transfer列表 */

    const ceTransferLists: CeTransfer[] = events
      .map((it: any, curIndex: number): CeTransfer | null => {
        if (it.event.method !== 'Transfer') {
          /* 过滤掉非转账的事件 */
          return null;
        }
        const {event, phase} = it;
        const {section} = event;
        const data = it.event?.toJSON().data;
        const [from, to, amount] = data;
        const {asApplyExtrinsic, ApplyExtrinsic} = phase;
        const allpyExtrinsicIndex =
          asApplyExtrinsic !== undefined ? asApplyExtrinsic : ApplyExtrinsic;

        const ceTransfer: CeTransfer = {
          amount: trillionCruFormat(amount), // 返回的是720136800,subscan显示的是0.0007201368   0.000720
          asset_symbol: '',
          eventIndex: `${blockNum}-${curIndex}`,
          // eventHash: hash.toHuman(),
          extrinsicIndex: `${ceExtrinsicLists[allpyExtrinsicIndex].extrinsicIndex}`,
          hash: `${ceExtrinsicLists[allpyExtrinsicIndex].extrinsicHash}`,
          blockNum,
          blockTimestamp,
          module: section,
          from,
          to,
          fee: '0',
          nonce: 0,
          finalized,
          eventSort: getSortIndex(`${blockNum}-${curIndex}`),
          success: ceExtrinsicLists[allpyExtrinsicIndex].success,
        };
        return ceTransfer;
      })
      .filter((it: any) => it) as CeTransfer[];
    /* ce_reward_slash列表 */

    const ceRewardSlashLists: CeRewardSlash[] = events
      .map((it: any, curIndex: number): CeRewardSlash | null => {
        if (!['Reward', 'Slash'].includes(it.event.method)) {
          /* 过滤掉非奖励和惩罚的事件 */
          return null;
        }
        // const it: EventRecord = item;

        const {event, phase} = it;
        const {method, section, meta, data} = event;
        const dataData = it.event?.toJSON().data;
        const [accountId, amount]: any = dataData;
        const asApplyExtrinsic = phase.asApplyExtrinsic.toHuman();

        const args: string[] = meta.args.toHuman() as string[]; // ['AccountId', 'SworkerPubKey']
        const argsValue: string[] = data.toHuman() as string[]; // ['5EWKQc9fNccv4WrLrNXS6DHqNQHG4F6b1MhnGsvU5VhqbMmz', '0xf580f355209251658531afec798a93985906e8c8eceb36b…e947a5f7679b3ae0d8555060d3fdb6595e13391478cfda01']
        const params = JSON.stringify(
          args.map((it: any, curIndex: number) => ({
            type: it,
            value: argsValue[curIndex],
          }))
        );
        const result: CeRewardSlash = {
          params,
          extrinsicIdx: ceExtrinsicLists[asApplyExtrinsic].extrinsicIdx,
          extrinsicHash: `${ceExtrinsicLists[asApplyExtrinsic].extrinsicHash}`,
          blockNum,
          blockTimestamp,
          eventId: method,
          eventIdx: curIndex,
          eventIndex: `${blockNum}-${curIndex}`,
          // eventHash: hash.toHuman(),
          validatorStash: author,
          accountId,
          moduleId: section,
          amount: trillionCruFormat(amount),
          eventSort: getSortIndex(`${blockNum}-${curIndex}`),
          success: ceExtrinsicLists[asApplyExtrinsic].success,
          finalized,
        };
        return result;
      })
      .filter((it: any) => it) as CeRewardSlash[];

    const resBlock: Block = {
      ...ceBlock,
      events: ceEventLists,
      extrinsics: ceExtrinsicLists,
      transfers: ceTransferLists,
      rewardSlashes: ceRewardSlashLists,
    };
    return resBlock;
  } catch (error) {
    throw `${blockNum} block error`;
  }
}
export async function queryBlockByBlockNums(
  blockNums: number[]
): Promise<Block[]> {
  try {
    const pAll = blockNums.map(item => {
      return queryOneBlockByBlockNum(item);
    });
    const result: any = await Promise.all(pAll);
    return result || [];
  } catch (error) {
    throw new Error(error);
  }
}

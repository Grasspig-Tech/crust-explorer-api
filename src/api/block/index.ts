import Log from '../../util/log';
import {ApiPromise} from '@polkadot/api';
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
// eslint-disable-next-line node/no-unpublished-import
import {Extrinsic} from '@polkadot/types/interfaces';

/**
 * 获取完整的区块信息，包括区块头，事件，交易，转账
 *
 * @export
 * @param {number} blockNum
 * @return {*}
 */
export async function queryOneBlockByBlockNum(
  blockNum: number,
  api: ApiPromise
): Promise<Block> {
  // const api = CrustWsPool.api;
  try {
    // debugger;
    // debugger;
    const blockHash = String(
      ((await api.rpc.chain.getBlockHash(blockNum)) as any).toHuman()
    );
    if (!blockHash) {
      console.error(`不存在区块高度为${blockNum}的区块`);
      throw new Error(`不存在区块高度为${blockNum}的区块`);
    }
    // let { block } = (await api?.rpc.chain.getBlock(blockHash) as any)?.block
    // let {
    //     block,
    //     author,
    //     extrinsics//交易列表

    // }: any = await api?.rpc.chain.getBlock(blockHash);
    let block: any;
    let extrinsics: any = [];
    let events = [];
    let author = '';
    try {
      /* placeholder是占位的，因为api?.derive.chain.getBlock(blockHash)报错会导致死循环 */
      const [blockInfo]: any = await Promise.all([
        api?.rpc.chain.getBlock(blockHash),
        api?.derive.chain.getBlock(blockHash),
      ]);
      // debugger;
      block = blockInfo.block;
      events = blockInfo.events;
      extrinsics = blockInfo.extrinsics;
      // debugger;
      author = blockInfo.author?.toHuman();
    } catch (error) {
      console.error(error);
    }
    // debugger;
    let blockHeader = block?.header?.toHuman(); //区块头信息
    blockHeader = blockHeader ? blockHeader : {};
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
    const [lastFinalizedBlockHash, authorInfo, specVersion] = await Promise.all(
      [
        api?.rpc.chain.getFinalizedHead().then((res: any) => res.toHuman()),
        api.derive.accounts.info(author),
        api.rpc.state
          .getRuntimeVersion(blockHash)
          .then((res: any) => Number(res.toJSON().specVersion)),
      ]
    );
    const accountDisplay = (
      await getAccountDisplay([{address: author}], api)
    )[0];
    // const accountDisplay = {
    //     address: author,
    //     ...JSON.parse(JSON.stringify(authorInfo.identity))
    // }
    // let lastFinalizedBlockHash = (await api?.rpc.chain.getFinalizedHead())?.toHuman();//最新确认区块哈希
    const finalizedBlock: any = await api.rpc.chain.getBlock(
      lastFinalizedBlockHash as string
    );
    const lastBlockNum: any = finalizedBlock?.block.header.number.toJSON();
    // let lastBlockNum: any = (await api?.rpc.chain.getBlock(lastFinalizedBlockHash as string))?.block.header.number.toJSON()//最新确认区块高度
    let finalized: Status;
    // debugger;
    const blockTimestamp: number = await getBlockTimestamp(extrinsics, 3, api);
    // debugger;
    // let blockTimestamp: number = 0;

    // debugger;
    // extrinsics.find((it: any): any => {
    //     /* 获取blockTimestamp */
    //     // debugger;
    //     // const extrinsicItem = JSON.parse(it.extrinsic.toString());
    //     // args: ['1,625,789,262,000'] , method:'set' , section:'timestamp'
    //     const { method: { section, method, args } } = it.extrinsic.toHuman();
    //     if (section === 'timestamp' && method === 'set') {
    //         // extract the Option<Moment> as Moment
    //         blockTimestamp = ms2S(removeDot(args[0]));
    //         // debugger;
    //         return true;
    //     }
    // })
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
    // debugger;
    const ceExtrinsicLists: CeExtrinsic[] = extrinsics.map(
      (item: any, curIndex: number): CeExtrinsic => {
        // debugger;

        const extrinsicFinalized: Status = isExtrinsicSuccess(item, api);
        const it: Extrinsic = item.extrinsic;
        // api.events.system.ExtrinsicFailed.is()
        /* args: [{name: 'curr_pk', type: 'SworkerPubKey'},...] */
        const args: any = it.meta.args.toHuman();
        /* argsValues对应args的值 */
        // const argsValues = it.args.map((it: any) => it.toHuman());
        const argsValues = it.args.map((it: any) => it.toJSON());
        // debugger;
        const params = args?.map((it: any, curIndex: number) => ({
          ...it,
          value: argsValues[curIndex],
        }));
        // debugger;
        const txToHuman: any = it.toHuman();
        const txToJSON: Extrinsic = JSON.parse(it.toString());
        const {method} = txToJSON;
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
          accountDisplay: '', //下边会统一获取
          fee: '0',
          finalized,
          signed: isSigned ? Status.Yes : Status.No,
          nonce: removeDot(nonce),
          signature,
          transfer: '', //下边会统一获取
          success: extrinsicFinalized,
        };
        return ceExtrinsic;
      }
    );
    /*
            统一获取extrinsic中transfer字段
                transfer: {from,to,amount,toAccountDisplay}
                暂时发现subscan的交易中callModule为balances  且callModuleFunction为transferKeepAlive或transfer
                    才有transfer字段
        */
    const ceExtrinsicListParams: {
      to: string;
      amount: number;
      index: number;
      from: string;
    }[] = ceExtrinsicLists
      .map((it, index) => ({
        from: it.accountId,
        params: JSON.parse(it.params),
        index,
        callModule: it.callModule,
        callModuleFunction: it.callModuleFunction,
      }))
      .filter(
        it =>
          it.callModule === 'balances' &&
          ['transferKeepAlive', 'transfer'].includes(it.callModuleFunction)
      )
      .map(it => ({
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
      }));
    /* 统一获取extrinsic中transfer里的to对应的accountDisplay */
    const toAccountDisplays = await getAccountDisplay(
      ceExtrinsicListParams.map(it => ({address: it.to})),
      api
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
      ceExtrinsicLists.map(it => ({address: it.accountId})),
      api
    );
    ceExtrinsicLists.forEach((item, index: number) => {
      item.accountDisplay = JSON.stringify(extrinsicAccountDisplays[index]);
    });
    /* ce_events列表 */
    // debugger;
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
        // debugger;
        // debugger;
        // debugger;
        const {hash} = it;
        const {meta, data} = it.event;
        it = it.toHuman();
        const {event, phase, topics} = it;
        const {method, section} = event;
        const {ApplyExtrinsic, asApplyExtrinsic} = phase;
        const allpyExtrinsicIndex =
          asApplyExtrinsic !== undefined ? asApplyExtrinsic : ApplyExtrinsic;
        // debugger;
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
        extrinsicHash = extrinsicHash ? extrinsicHash : '';
        let extrinsicIndex =
          ceExtrinsicLists[allpyExtrinsicIndex]?.extrinsicIndex;
        extrinsicIndex = extrinsicIndex ? extrinsicIndex : '';
        const success: Status =
          allpyExtrinsicIndex === undefined
            ? Status.Yes
            : ceExtrinsicLists[allpyExtrinsicIndex]?.success;
        let extrinsicIdx = Number(allpyExtrinsicIndex);
        if (extrinsicIdx !== 0 && !extrinsicIdx) {
          extrinsicIdx = -1;
        }
        // api.events.system.ExtrinsicFailed.is()
        // debugger;
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
    // debugger;
    const ceTransferLists: CeTransfer[] = events
      .map((it: any, curIndex: number): CeTransfer | null => {
        if (it.event.method !== 'Transfer') {
          /* 过滤掉非转账的事件 */
          return null;
        }

        // debugger;
        // const transferToJson = JSON.parse(it.toString());
        // debugger;
        const {event, hash, phase, topics} = it;
        const {method, section} = event;
        const data = it.event.toJSON().data;
        const [from, to, amount] = data;
        const {asApplyExtrinsic, ApplyExtrinsic} = phase;
        const allpyExtrinsicIndex =
          asApplyExtrinsic !== undefined ? asApplyExtrinsic : ApplyExtrinsic;
        // debugger;
        const ceTransfer: CeTransfer = {
          amount: trillionCruFormat(amount), //返回的是720136800,subscan显示的是0.0007201368   0.000720
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
    // debugger;
    const ceRewardSlashLists: CeRewardSlash[] = events
      .map((it: any, curIndex: number): CeRewardSlash | null => {
        // debugger;
        if (!['Reward', 'Slash'].includes(it.event.method)) {
          /* 过滤掉非奖励和惩罚的事件 */
          return null;
        }
        // const it: EventRecord = item;
        // debugger;
        const {event, hash, phase, topics} = it;
        const {method, section, meta, data} = event;
        const dataData = it.event.toJSON().data;
        const [accountId, amount]: any = dataData;
        const asApplyExtrinsic = phase.asApplyExtrinsic.toHuman();
        // debugger;
        const args: string[] = meta.args.toHuman() as string[]; //['AccountId', 'SworkerPubKey']
        const argsValue: string[] = data.toHuman() as string[]; //['5EWKQc9fNccv4WrLrNXS6DHqNQHG4F6b1MhnGsvU5VhqbMmz', '0xf580f355209251658531afec798a93985906e8c8eceb36b…e947a5f7679b3ae0d8555060d3fdb6595e13391478cfda01']
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
    // debugger;

    const resBlock: Block = {
      ...ceBlock,
      events: ceEventLists,
      extrinsics: ceExtrinsicLists,
      transfers: ceTransferLists,
      rewardSlashes: ceRewardSlashLists,
    };
    return resBlock;
  } catch (error) {
    Log.error(`${blockNum} 区块报错 `);
    throw new Error(`${blockNum} 区块报错`);
  }
}
export async function queryBlockByBlockNums(
  blockNums: number[],
  api: ApiPromise
): Promise<Block[]> {
  try {
    const pAll = blockNums.map(item => {
      return queryOneBlockByBlockNum(item, api);
    });
    const result: Block[] = await Promise.all(pAll);

    return result;
  } catch (error) {
    throw new Error(error);
  }
}

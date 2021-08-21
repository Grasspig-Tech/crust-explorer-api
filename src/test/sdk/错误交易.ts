import {ApiPromise} from '@polkadot/api';
import grantWs from '../../api/grant-ws';

test();

async function test() {
  const api: ApiPromise = await grantWs.connect('getBlock');

  const __blockHash = [
    '0x7754d5dc5f74208f0956377976899b97c85066881281179b22972812c206a577', //2369651含有奖励staking(Reaward)事件
    '0x95281e12ea00b7de7ee76516e58e9373aba006899bbb855490542f28378407e2', //2369654含有转账
  ];
  const __blockNum = [
    2369502,
    2369497,
    2356855, //含有失败的交易
    (await api?.query.system.number()).toJSON(), //最新区块高度，不一定是确认的
  ];
  // debugger;
  const blockHash11 = await api.rpc.chain.getBlockHash(__blockNum[2]);
  const block11: any = await api.derive.chain.getBlock(blockHash11);
  console.log('区块：', __blockNum[2]);
  debugger;
  for (let i = 0; i < (block11 as any)?.events.length; i++) {
    // console.log(block11.events[i].event.toHuman().method)

    // if (block11.events[i].event.toHuman().method === "ExtrinsicFailed") {
    if (api.events.system.ExtrinsicFailed.is(block11?.events[i].event)) {
      console.log('事件：', i);
      console.log(
        '交易hash：',
        block11?.extrinsics[
          block11?.events[i].phase.asApplyExtrinsic.toJSON()
        ].extrinsic.hash.toJSON()
      );
    }
    // let success = await api.events.system.ExtrinsicSuccess.is(block11?.events[i].event as any)
    // if (!success) {
    //     console.log("发现错误交易")
    //     console.log("发现错误交易")

    // }
    // console.log("------------------")
  }
  // let ooo = await api.events.system.ExtrinsicSuccess.is(block11?.events[0].event as any)
  // console.log(block11?.toHuman())
  // let block22 = await api.rpc.chain.getBlock(__blockHash[0]);
  // console.log(block11)

  debugger;
}

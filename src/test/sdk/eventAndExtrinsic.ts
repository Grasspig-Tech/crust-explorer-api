import { ApiPromise } from "@polkadot/api"
import grantWs from "../../api/grant-ws"
import { SignedBlock } from "@polkadot/types/interfaces"
test();

async function test() {
    // Construct
    // const wsProvider = new WsProvider('wss://api.decloudf.com/');
    const api: ApiPromise = await grantWs.connect("getBlock");

    // Do something
    // console.log(api.genesisHash.toHex());
    const __blockHash = [
        "0x7754d5dc5f74208f0956377976899b97c85066881281179b22972812c206a577",//2369651含有奖励staking(Reaward)事件
        "0x95281e12ea00b7de7ee76516e58e9373aba006899bbb855490542f28378407e2"//2369654含有转账
    ];
    const __blockNum = [
        2369502,
        2369497,
        (await api?.query.system.number()).toJSON() //最新区块高度，不一定是确认的
    ]
    let blockHash11 = await api.rpc.chain.getBlockHash(__blockNum[2]);
    let block11: any = await api.derive.chain.getBlock(blockHash11);
    let block22: any = await api.rpc.chain.getBlock(blockHash11);
    let events = block11.events;
    let extrinsics = block11.extrinsics;
    console.log("区块")
    console.log(block11)
    console.log("事件")
    console.log(events)
    console.log(events.toHuman())
    console.log("交易")
    console.log(extrinsics)
    // let block22 = await api.rpc.chain.getBlock(__blockHash[0]);
    // console.log(block11)

    debugger;



}



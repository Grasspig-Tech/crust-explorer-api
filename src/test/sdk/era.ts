import { ApiPromise } from "@polkadot/api"
import grantWs from "../../api/grant-ws"
import { SignedBlock } from "@polkadot/types/interfaces"
test();

async function test() {
    // Construct
    // const wsProvider = new WsProvider('wss://api.decloudf.com/');
    const api: ApiPromise = await grantWs.connect("getBlock");

    // // Do something
    // // console.log(api.genesisHash.toHex());
    // const __blockHash = [
    //     "0x7754d5dc5f74208f0956377976899b97c85066881281179b22972812c206a577",//2369651含有奖励staking(Reaward)事件
    //     "0x95281e12ea00b7de7ee76516e58e9373aba006899bbb855490542f28378407e2"//2369654含有转账
    // ];
    // const __blockNum = [
    //     2369502,
    //     2369497,
    //     (await api?.query.system.number()).toJSON(), //最新区块高度，不一定是确认的

    //     2381737,//799纪元的起始块

    //     2378145,//798纪元的起始块

    //     2374548,//797纪元的起始块

    //     2370956,//796纪元的起始块

    // ]
    // let [hash11, hash22, hash33, hash44]: any = await Promise.all([
    //     api.rpc.chain.getBlockHash(__blockNum[3]),
    //     api.rpc.chain.getBlockHash(__blockNum[4]),
    //     api.rpc.chain.getBlockHash(__blockNum[5]),
    //     api.rpc.chain.getBlockHash(__blockNum[6]),
    // ]);
    // let [block11, block22, block33, block44]: any = await Promise.all([
    //     api.derive.chain.getBlock(hash11),
    //     api.derive.chain.getBlock(hash22),
    //     api.derive.chain.getBlock(hash33),
    //     api.derive.chain.getBlock(hash44),
    // ])
    // debugger;
    // let era11 = await api.query.staking.currentEra.at(blockHash11)
    // let era22 = await api.query.staking.activeEra.at(blockHash11);
    /* 799纪元 */
    let era44 = await api.query.staking.activeEra();
    // let duration = api.consts.staking.bondingDuration;
    // let wqeo = await api.query.staking.erasStartSessionIndex(era44)

    // console.log(wqeo)
    // console.log(wqe)
    debugger;

    // let eraIndex22 = await api.query.staking.erasStartSessionIndex([era44])
    // let eraIndex33 = await api.query.staking.erasStartSessionIndex([era77])

    // debugger;



}



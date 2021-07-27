import { ApiPromise } from "@polkadot/api"
import grantWs from "../../api/grant-ws"
import { SignedBlock } from "@polkadot/types/interfaces"
import { getBlockTimestamp } from "../../util"
import { getLocks } from "../../util"
test();


async function test() {
    // Construct
    // const wsProvider = new WsProvider('wss://api.decloudf.com/');
    const api: ApiPromise = await grantWs.connect("getBlock");
    let res22 = await getLocks([
        '5G4ch9r3xoxUUGoWLbTGJzke419FbkhoNCVTxotCQQALp8tw',
        '5CJ2GyPuBsvJ5xYv7ZmLcH25WXJKGFJPFN2dhFUcMNBo97ss',
        '5EJPtyWs9M3vEVGjcyjTMeGQEsnowwouZAUnFVUmdjJyPpBM',
        '5F9BYd21i2p6UL4j4CGZ6kFEBqnzyBuH6Tw6rGxhZsVg3e3q',
        '5DCyMmA7c4TMb9wnNZoQdc4LnMKSLvbEVsnybmrMqgbxBnps',
    ], api)
    // let res = await Promise.all([

    //     api.query.balances.locks('5G4ch9r3xoxUUGoWLbTGJzke419FbkhoNCVTxotCQQALp8tw'),
    //     api.query.balances.locks('5CJ2GyPuBsvJ5xYv7ZmLcH25WXJKGFJPFN2dhFUcMNBo97ss'),
    //     api.query.balances.locks('5EJPtyWs9M3vEVGjcyjTMeGQEsnowwouZAUnFVUmdjJyPpBM'),
    //     api.query.balances.locks('5F9BYd21i2p6UL4j4CGZ6kFEBqnzyBuH6Tw6rGxhZsVg3e3q'),
    //     api.query.balances.locks('5DCyMmA7c4TMb9wnNZoQdc4LnMKSLvbEVsnybmrMqgbxBnps'),

    //     // api.query.balances.account(),
    //     // api.query.balances.reserves()
    // ])
    debugger;

    // debugger;



}



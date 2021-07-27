import { ApiPromise } from "@polkadot/api"
import grantWs from "../../api/grant-ws"
import { SignedBlock } from "@polkadot/types/interfaces"
test();

function toBytes(str: any): any {

    let st: any = [];
    let re: any = [];
    let ch: any = [];
    for (var i = 0; i < str.length; i++) {
        ch = str.charCodeAt(i);  // get char  
        st = [];                 // set up "stack"  

        do {
            st.push(ch & 0xFF);  // push byte to stack  
            ch = ch >> 8;          // shift value down by 1 byte  
        }

        while (ch);
        // add stack contents to result  
        // done because chars have "wrong" endianness  
        re = re.concat(st.reverse());
    }
    // return an array of bytes  
    return re;
}

async function test() {
    // Construct
    // const wsProvider = new WsProvider('wss://api.decloudf.com/');
    const api: ApiPromise = await grantWs.connect("getBlock");
    let blockHash = '0x0c08e75286b26c03419ab6015844b25b90b8f178d9c457b6b75832a959392014'

    let [placeholder, blockInfo]: any = await Promise.all([
        api?.rpc.chain.getBlock(blockHash),
        api?.derive.chain.getBlock(blockHash)
    ])
    let extrinsics = blockInfo.extrinsics;
    console.log(extrinsics)
    console.log(extrinsics[0].extrinsic.hash.toJSON())
    // debugger;
    // let res = await api.rpc.payment.queryInfo(toBytes(extrinsics[0].extrinsic.hash.toJSON()), blockHash);
    // let res = await api.rpc.payment.queryInfo(extrinsics[0].extrinsic.dispatchInfo, blockHash);
    let res = await api.rpc.payment.queryInfo(extrinsics[0].extrinsic.hash.toJSON())
    // let res2 = await api.derive.staking.query('5DvTCFuPUXb6Vzg5NB4mFu3Hz95GUqXTMLXib66e4KhF9wxW',
    //     {
    //         withController: false,
    //         withExposure: true,
    //         // withDestination: true,
    //         // withLedger: true,
    //         withNominations: true,
    //         // withPrefs: true
    //     }
    // )
    // console.log(res2)
    debugger;

    // debugger;



}



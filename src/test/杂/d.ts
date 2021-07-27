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
    // let rr = await api.query.system.accounts.entriesPaged()
    let rr = await api.query.staking.guarantors.entries()
    // api.query.staking
    debugger;
    console.log(rr)
    let tmp = rr.filter((it: any, cur): any => { if (it[1].toJSON().targets.length === 0) { console.log(cur); return true; } })
    // let tmp22 = rr.filter((it: any) => it[1].toJSON().suppressed)
    // rr = rr.filter((it: any) => it[1].toJSON().submitted_in === 812);
    // debugger;
    rr.sort((a: any, b: any) => {
        return a[1].toJSON().submitted_in - b[1].toJSON().submitted_in
    })
    rr.forEach((it: any) => {
        console.log(it[1].toJSON().submitted_in)
    })
    debugger;
    // if (rr.find((it: any, cur): any => { if (it[1].toJSON().targets.length === 0) { console.log(cur); return true; } })) {
    //     console.log()
    // }
    rr.forEach(it => {
        debugger;
        console.log(it[0].hash.toJSON())
        console.log("---------------")
    })
    debugger;

    // debugger;



}



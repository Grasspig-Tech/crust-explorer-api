import { ApiPromise } from "@polkadot/api"
import grantWs from "../../api/grant-ws"

test();

async function test() {
    const api: ApiPromise = await grantWs.connect("getBlock");
    let aa = await api.derive.staking.waitingInfo();
    
    // let ewqo22 = await api.derive.staking.overview();
    console.log(aa)
    console.log(aa.waiting)
    for (let item of aa.waiting) {
        console.log(item.toJSON())
    };
    debugger;



}



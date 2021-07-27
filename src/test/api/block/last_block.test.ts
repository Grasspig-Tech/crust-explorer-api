import { getLastBlock, getBlockByBlockNum } from "../../../service/block"
import { ApiPromise } from "@polkadot/api"
import grantWs from "../../../api/grant-ws"
import { filterRepeatData } from "../../../util"
main();
async function main() {
    const api: ApiPromise = await grantWs.connect("aa");
    const row: number = 100;

    let blocks = await getLastBlock({ row, api })
    let allAccount =
        blocks
            .map(it => it.transfers)
            .reduce((prev, cur) => [...prev, ...cur], [])
            .reduce((prev: any, cur) => [...prev, cur.from, cur.to], [])
    console.log(allAccount);
    console.time("cccc")
    let ooo = filterRepeatData(allAccount);
    console.timeEnd("cccc")
    console.log(ooo)
    console.log(blocks);
    debugger;
}


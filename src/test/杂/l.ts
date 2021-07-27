import { ApiPromise } from "@polkadot/api"
import grantWs from "../../api/grant-ws"
import { SignedBlock } from "@polkadot/types/interfaces"
import { compare, filterRepeatData, getBlockTimestamp, getControllerAddressByStashAddress } from "../../util"
import { getLocks } from "../../util"
import got from "got"
import { queryEras } from "../../api/era"
test();


async function test() {
    // Construct
    // const wsProvider = new WsProvider('wss://api.decloudf.com/');
    // debugger;
    const api: ApiPromise = await grantWs.connect("getBlock");
    // debugger;
    let wqeo = await api.query.swork.free();
    let pp = await api.query.swork.reportedFilesSize();
    // let pp2 = await api.query.market.filesSize();
    // debugger;
    let ttt: any = await queryEras({ api });
    let SPLORER_API = 'https://splorer-api.crustcode.com/api'; // crust storage 存储 api
    let SPLORER_AUTHORIZATION = 'Basic Y3J1c3Q6MTYyNTM0'; // crust storage 存储 api 认证
    let rr44: any = await got.get("https://splorer-api.crust.network/api/owners", {
        headers: {
            Authorization: 'Basic Y3J1c3Q6MTYyNTM0'
        },
        searchParams: {
            pageSize: 50000,
            pageIndex: 1
        },
        responseType: "json"
    });
    let rr = await api.query.swork.groups.entries();
   
    let totall = 0;
    let tmppp1 = filterRepeatData
    let tmppp2 = compare;

    let alll = rr.map(it => it[1].toJSON()).reduce((prev: any, cur: any) => [...prev, ...cur], []);
    let filterRepeatAll = filterRepeatData(alll);
    let rwae = await getControllerAddressByStashAddress(filterRepeatAll, api);
    // 
    let address: any[] = [
        '5EtKPUiw6BuF8C7EDVVeCY5sAecm3w7vq4vrmgKHFQui7ozB',
        '5HhAKzsQ9wYq4dBoMvCXRmgoAxYQLzFj26VaZSLNquGBCHAi'
    ]
    let result = await api.queryMulti([
        ...(address as any).map((it: any) => [api.query.staking.bonded, it])
    ])
    // debugger;
    // let ii = await api.rpc.state.getKeys(rr[0][0])
    // let pp = await api.query.system.accounts.entries();
    // let rr = await api.rpc.state.getKeys(null, '0xd2bc339201fadf9be6f07cf9e525628ace24e3bdf50a84b694475f5928df819c')

    // console.log(oo)
    debugger;

    // debugger;



}



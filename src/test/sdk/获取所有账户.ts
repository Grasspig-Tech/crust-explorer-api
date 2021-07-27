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
    // let wqeo = await api.query.swork.free();
    // let pp = await api.query.swork.reportedFilesSize();
    // let pp2 = await api.query.market.filesSize();
    // debugger;
    // let ttt: any = await queryEras({ api });
    // let SPLORER_API = 'https://splorer-api.crustcode.com/api'; // crust storage 存储 api
    // let SPLORER_AUTHORIZATION = 'Basic Y3J1c3Q6MTYyNTM0'; // crust storage 存储 api 认证
    // let rr44: any = await got.get("https://splorer-api.crust.network/api/owners", {
    //     headers: {
    //         Authorization: 'Basic Y3J1c3Q6MTYyNTM0'
    //     },
    //     searchParams: {
    //         pageSize: 50000,
    //         pageIndex: 1
    //     },
    //     responseType: "json"
    // });
    // let ppp22 = await api.query.swork.reportedFilesSize();
    // let ppp = await api.query.swork.reportedFilesSize.at('0xe53e3be5b023617bd04f7940cc4b950c4cd89bce2877c69c39bc88caf80939e5');
    // console.log(Number(ppp22.toJSON()))
    // console.log(Number(ppp.toJSON()))
    // let oopq = await api.query.market.files()
    // let price22 = await api.query.market.fileBaseFee();
    // let price = await api.query.market.files('0xe9ffec3b7f33908aca0128571f726380a2139307e301b4f9f3022e556e61e49b');
    // let price222 = await api.query.market.files('0xe7091c7180ca9556293ab9f897a826efebff6e99937963301633b00b17bc2a5c');
    // let wqpep = await api.query.transactionPayment.nextFeeMultiplier();
    // let sad = await api.rpc.payment.queryInfo('0x0942b7e11702ffb419cf1f3e543252f00f973203b42cb11ffb3a07482fa4119c')
    let aaa = await api.query.system.account.entries();
    let mapaaa = aaa.map(it => {
        return [it[0].toHuman(), it[1].toJSON()]
    })
    let tmpFilter = filterRepeatData;
    let wqe = filterRepeatData(mapaaa.map((it: any) => it[0][0]));
    // let padp = await api.rpc.state.getKeys(mapaaa[0][0]);
    // let oewqp = await api.rpc.state.getReadProof([mapaaa[0][0]])
    // let oewqp33 = await api.rpc.state.getStorage(mapaaa[0][0])
    console.log(mapaaa)
    // let sad = await api.rpc.payment.queryInfo
    debugger;

    // debugger;



}



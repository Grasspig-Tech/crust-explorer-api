import { ApiPromise } from "@polkadot/api"
import grantWs from "../../api/grant-ws"
import { SignedBlock } from "@polkadot/types/interfaces"
import { getBlockTimestamp } from "../../util"
test();


async function test() {
    // Construct
    // const wsProvider = new WsProvider('wss://api.decloudf.com/');
    const api: ApiPromise = await grantWs.connect("getBlock");
    // let rr = await api.query.system.accounts.entriesPaged()
    let aa = (await api?.query.system.number())?.toJSON();
    let bb = await api.rpc.chain.getBlock();
    let cc = await api.derive.chain.bestNumber()
    let dd = (await api.derive.chain.bestNumberFinalized()).toJSON();
    let ee = await api.query.system.eventCount();
    let wae = await getBlockTimestamp(cc.toJSON(), 1, api);
    let rr = await Promise.all([
        api.query.system.extrinsicCount(),
        api.query.system.events(),
        api.query.candy.total(),
        api.rpc.chain.getHeader(),
        api.derive.staking.overview(),
        api.query.candy.total(),
        api.query.elections.members(),
        api.query.staking.erasTotalStakes(813),
        api.query.swork?.free(),
        api.query.swork?.used(),
        // api.query.system.account(),

    ]);
    let waeee = await Promise.all([
        api.query.staking.erasRewardPoints(813),
        api.query.staking.historyDepth(),
        api.query.staking.guarantors.entries(),
        api.query.staking.erasStartSessionIndex(813),
        api.query.staking.erasTotalStakes(813),
        (api.query.staking.validators.entries()),
        api.query.balances.totalIssuance()
    ])
    let tmp = waeee[2].map((it: any) => it[1].toJSON());
    let tmp22 = waeee[5].map((it: any) => it[1].toJSON());
    // let aaa = tmp.filter(it => it.targets.length > 0);
    // console.log(aaa)
    let validators: string[] = [];
    tmp.forEach(it => {
        it.targets.forEach((item: any) => {
            if (!validators.find(it => it === item.who)) {
                validators.push(item.who);
            }
        })
    })
    console.log(validators)

    console.log(aa)
    debugger;

    // debugger;



}



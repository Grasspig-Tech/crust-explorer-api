import { ApiPromise } from "@polkadot/api"
import grantWs from "../../api/grant-ws"
import { SignedBlock } from "@polkadot/types/interfaces"
test();

async function test() {
    // Construct
    // const wsProvider = new WsProvider('wss://api.decloudf.com/');
    const api: ApiPromise = await grantWs.connect("getBlock");
    let arr: any = await Promise.all([
        api.query.technicalMembership.members(),
        api.query.technicalMembership.prime(),
        api.query.technicalCommittee.members(),
        api.query.technicalCommittee.prime(),
        api.rpc.system.accountNextIndex('5EYCAe5g8Nk91uGKxvfL8xdY7VwfUP9JJDdBbDuGFB6cy4cY'),
        api.rpc.system.accountNextIndex('5FpkWoyBeu7vfe16qZKBWXcaoK5nYi9d7F8WhCo4ZTacQFnj'),
        api.query.elections.members()
    ])
    // debugger;
    let rr1 = await api.query.identity.identityOf(arr[6].toJSON()[0].who)
    let rr2 = await api.query.identity.superOf(arr[6].toJSON()[0].who)
    let rr3 = await api.query.identity.subsOf(arr[6].toJSON()[0].who)
    let rr4 = await api.query.indices.accounts(arr[6].toJSON()[0].who)
    let rr5 = await api.query.swork.groups(arr[6].toJSON()[0].who)
    let rr6 = await api.rpc.rpc.methods();
    let rr7 = await api.query.staking.erasStakers(809, '5DvTCFuPUXb6Vzg5NB4mFu3Hz95GUqXTMLXib66e4KhF9wxW')
    let asd = await api.query.staking.guarantors(rr7.others[0].who)
    debugger
    console.log(arr)
    // console.log(rr)
    debugger;

    // debugger;



}



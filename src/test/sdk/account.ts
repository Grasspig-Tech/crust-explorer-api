import { ApiPromise } from "@polkadot/api"
import grantWs from "../../api/grant-ws"
import { SignedBlock } from "@polkadot/types/interfaces"
test();

async function test() {
    // Construct
    // const wsProvider = new WsProvider('wss://api.decloudf.com/');
    const api: ApiPromise = await grantWs.connect("getBlock");
    const accountHash = [
        '5DvTCFuPUXb6Vzg5NB4mFu3Hz95GUqXTMLXib66e4KhF9wxW',
        '5CRxxN4YawZJ461bPehGYnA5xBSrhTvpiKSn3mZizmdGCC3j',
        '5DypPaki2afCAvLdLcjfPujAs1F9qo9od2CqteawyP4Pq6kb',
        '5ERnJzoFRFeY8Pj71PPjBmbm9uiLHVxvUyvXBomDXpYCTE7U',
        '5DX2KxEncXiGfaWdViWBTmeU4nBhcwq9iz62ordimnX2eRyx',
    ]
    let io = await api.query.balances.account(accountHash[2])
    let io22 = await api.query.balances.locks(accountHash[2])
    let io33 = await api.query.democracy.locks(accountHash[2])
    const account11 = await api.derive.accounts.info(accountHash[0]);
    const account22 = await api.derive.accounts.info(accountHash[1]);
    const aasd = await api.query.system.account(accountHash[0])
    let wqe = await api.queryMulti([
        // [api.query.system.account, accountHash[0]],
        // [api.query.system.account, accountHash[1]],
        // [api.query.system.account, accountHash[2]],
        // [api.query.system.account, accountHash[3]],
        // [api.query.system.account, accountHash[4]],

        // 查质押冻结信息，只能api.query.staking.erasStakersClipped
        [api.query.staking.erasStakersClipped, [811, '5DvTCFuPUXb6Vzg5NB4mFu3Hz95GUqXTMLXib66e4KhF9wxW']],
        [api.query.staking.erasStakersClipped, [811, '5FBs3aqYmyBREyrW9CDsUKARbwsPPffniPPCDmQonTaMLqb2']],
        [api.query.staking.erasStakersClipped, [811, '5GU67fpJTd3iWnmFAXA3TKjwxdMdju54HzrUDB3hLMPyoNtV']],
        [api.query.staking.erasStakersClipped, [811, '5GBRJWpphuWF6zQeqnLVHoPkTXYgtNCWngisSF4zMpAxV2pZ']],
        [api.query.staking.ledger,'5DvTCFuPUXb6Vzg5NB4mFu3Hz95GUqXTMLXib66e4KhF9wxW'],
        [api.query.staking.ledger,'5FBs3aqYmyBREyrW9CDsUKARbwsPPffniPPCDmQonTaMLqb2'],
        [api.query.staking.ledger,'5GU67fpJTd3iWnmFAXA3TKjwxdMdju54HzrUDB3hLMPyoNtV'],
        [api.query.staking.ledger,'5GBRJWpphuWF6zQeqnLVHoPkTXYgtNCWngisSF4zMpAxV2pZ'],
    ])
    
    console.log(wqe)

    // console.log(account)
    // let qwe = await api.derive.accounts.identity('5DvTCFuPUXb6Vzg5NB4mFu3Hz95GUqXTMLXib66e4KhF9wxW')


    debugger;

    // debugger;



}



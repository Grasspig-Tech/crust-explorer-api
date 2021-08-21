import {ApiPromise} from '@polkadot/api';
import grantWs from '../../api/grant-ws';
import {SignedBlock} from '@polkadot/types/interfaces';
test();

async function test() {
  // Construct
  // const wsProvider = new WsProvider('wss://api.decloudf.com/');
  const api: ApiPromise = await grantWs.connect('getBlock');

  // Do something
  // console.log(api.genesisHash.toHex());
  const __blockHash = [
    '0x7754d5dc5f74208f0956377976899b97c85066881281179b22972812c206a577', //2369651含有奖励staking(Reaward)事件
    '0x95281e12ea00b7de7ee76516e58e9373aba006899bbb855490542f28378407e2', //2369654含有转账
  ];
  const __blockNum = [
    2369502,
    2369497,
    (await api?.query.system.number()).toJSON(), //最新区块高度，不一定是确认的

    2381737, //799纪元的起始块

    2378145, //798纪元的起始块

    2374548, //797纪元的起始块

    2370956, //796纪元的起始块
  ];
  const blockHash11 = await api.rpc.chain.getBlockHash(__blockNum[2]);
  // let block11: any = await api.derive.chain.getBlock(blockHash11);
  // let block22: any = await api.rpc.chain.getBlock(blockHash11);
  // let era11 = await api.query.staking.currentEra.at(blockHash11)
  // let era22 = await api.query.staking.activeEra.at(blockHash11);
  // /* 799纪元 */
  // let era44 = await api.query.staking.activeEra();
  // /* 798的纪元 */
  // let era55 = await api.query.staking.currentEra.at("0x7a8e9c6e01d40b8906857562d651851d14ec797ec436e8d5cc41656e4d00ee6c")
  // let era66 = await api.query.staking.activeEra.at("0xf233452ffdb4b8c5815049efee608311eff87de50daee70b5b34cf043687eacc");
  // let era77 = await api.query.staking.activeEra.at("0xaff29e2eb982f46025ef5adcc504b77ca906df289c22c76f5771d824e271c63b");
  // debugger;
  // debugger;
  // let asd = await api.query.staking.erasValidatorPrefs.entries((era44.toJSON() as any).index as number)
  // let jjk = await api.query.staking.erasStartSessionIndex.at(blockHash11)

  // let asod: any = await api.derive.session.info();
  api.rpc.chain.subscribeFinalizedHeads(async res => {
    console.log(res);
    const aaaNum = (await api?.query.system.number()).toJSON();
    const bbbNum: any = res.toJSON().number;
    // debugger;
    const [iiq, ...qwi]: any = await Promise.all([
      api.derive.session.progress(),
      api.derive.session.eraLength(),
      api.derive.session.eraProgress(),
      api.derive.session.indexes(),
      api.derive.session.info(),
      api.derive.session.sessionProgress(),
    ]);
    debugger;
    const uui = await api.query.session.currentIndex.at(
      '0xcc02b5b2ae6cc97f6a63e24aa38cd1e3684da709bb9ac1defae33301f7451394'
    );
    const aqo = await api.query.imOnline.authoredBlocks(
      uui.toJSON(),
      '5DvTCFuPUXb6Vzg5NB4mFu3Hz95GUqXTMLXib66e4KhF9wxW'
    );
    console.log(uui);
    console.log(aqo);
    // for (let item of qwi) {
    //     for (let prop in item) {
    //         if (item[prop] && item[prop].toJSON) {
    //             console.log(`${prop}：`, item[prop].toJSON())
    //         } else {
    //             console.log(`${prop}：`, item[prop])
    //         }
    //     };
    // };
    debugger;
    // let iiq22: any = await api.derive.session.sessionProgress();
    // let
    // for (let prop in asod) {
    //     if (asod[prop].toJSON) {
    //         console.log(`${prop}：`, asod[prop].toJSON())
    //     } else {
    //         console.log(`${prop}：`, asod[prop])

    //     }
    // };
    // console.log("-------------")
    for (const prop in iiq) {
      if (iiq[prop].toJSON) {
        console.log(`${prop}：`, iiq[prop].toJSON());
      } else {
        console.log(`${prop}：`, iiq[prop]);
      }
    }
    console.log('结束高度:', bbbNum);
    console.log(bbbNum - 2374548);
    console.log(iiq.eraProgress.toJSON());
    console.log('最新确认区块：', bbbNum - iiq.eraProgress.toJSON());
    console.log('最新区块：', aaaNum - iiq.eraProgress.toJSON());

    debugger;
  });

  // let eraIndex22 = await api.query.staking.erasStartSessionIndex([era44])
  // let eraIndex33 = await api.query.staking.erasStartSessionIndex([era77])

  // debugger;
}

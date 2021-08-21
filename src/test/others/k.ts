import {ApiPromise} from '@polkadot/api';
import grantWs from '../../api/grant-ws';
import {SignedBlock} from '@polkadot/types/interfaces';
import {getBlockTimestamp} from '../../util';
import {getLocks} from '../../util';
test();

async function test() {
  // Construct
  // const wsProvider = new WsProvider('wss://api.decloudf.com/');
  const api: ApiPromise = await grantWs.connect('getBlock');
  // debugger;
  // let oo = api.rpc.net.peerCount;
  // let oo = api.rpc.net.peerCount.json();
  // let oo = await api.rpc.eth.accounts();
  const oo2 = api.consts.staking.sessionsPerEra;
  // let oo3 = await api.query.market.filesSize.at('0xd2bc339201fadf9be6f07cf9e525628ace24e3bdf50a84b694475f5928df819c')
  // let oo4 = await api.rpc.eth.coinbase();
  // let oo5 = await api.query.system.accounts()
  // api.rpc.state.getStorageSize();
  // let oo3 = await api.rpc.state.getMetadata('0xd2bc339201fadf9be6f07cf9e525628ace24e3bdf50a84b694475f5928df819c')
  console.time('ces');
  // let oo4 = await api.rpc.state.getRuntimeVersion('0x10d8cb6a10e41756acf9cc2297d386d6f612af46f5b7e97ed6a26a91040a8273')
  // let oo4 = await api.rpc.state.getRuntimeVersion('0x6a09a6c67a07e90321d1890addddc32522e68789153a0236810ac947b7611a64')
  const res = await api.query.market.files(
    '0x7a15ccfb0517f63ccac9976af22d4ef9c8b53a01a065ef5ce055b2b672c680f9'
  );
  console.timeEnd('ces');
  const res2 = await api.query.session.disabledValidators();
  const res33 = await api.query.staking.validatorCount();
  const res44 = await api.query.swork.groups(
    '5FgeE5xLr3f8Q11QeDrDtmr5nvzCrjdrTDDf1R1nsyfdLQVg'
  );
  const res55 = await api.query.swork.groups(
    '5DvTCFuPUXb6Vzg5NB4mFu3Hz95GUqXTMLXib66e4KhF9wxW'
  );
  const res66 = await api.query.technicalMembership.members();
  const res77 = await api.query.technicalMembership.prime();
  const res99 = await api.query.claims.superior();
  console.log(res33);
  debugger;
  // let rr = await api.rpc.state.getKeys(null, '0xd2bc339201fadf9be6f07cf9e525628ace24e3bdf50a84b694475f5928df819c')

  // console.log(oo)
  debugger;

  // debugger;
}

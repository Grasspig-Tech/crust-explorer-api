import {ApiPromise} from '@polkadot/api';
import grantWs from '../../api/grant-ws';
import {SignedBlock} from '@polkadot/types/interfaces';
import {getControllerAddressByStashAddress} from '../../util';
test();

async function test() {
  // Construct
  // const wsProvider = new WsProvider('wss://api.decloudf.com/');
  const api: ApiPromise = await grantWs.connect('getBlock');
  const res = api.consts.transactionPayment.transactionByteFee;
  // let res22 = await api.query.market.fileBaseFee.;
  const res22 = await api.query.technicalMembership.members();
  // let res33 = await api.query.timestamp.now.hash();
  const res44 = await api.query.authorship.author.at(
    '0x87eb7270cb12e24e979ff4517596ad951652118c19ee2f5ca2543085c0ddc01b'
  );
  const oo = await api.query.grandpa.state.at(
    '0x87eb7270cb12e24e979ff4517596ad951652118c19ee2f5ca2543085c0ddc01b'
  );
  // let oo2 = await api.query.scheduler.agenda()
  // let oo3 = await api.query.technicalCommittee.members();
  // let oo4 = await api.query.elections.members();
  // let oo5 = await api.query.identity.registrars();
  // let oo6 = await api.query.council.members();
  let [councilMembers, technicalCommittees, registrars]: any =
    await api.queryMulti([
      [api.query.council.members],
      [api.query.technicalCommittee.members],
      [api.query.identity.registrars],
    ]);
  councilMembers = councilMembers.toJSON();
  technicalCommittees = technicalCommittees.toJSON();
  registrars = registrars.toJSON().map((it: any) => it.account);
  const rrr11 = await getControllerAddressByStashAddress(
    [...councilMembers],
    api
  );
  const rrr22 = await getControllerAddressByStashAddress(
    [...technicalCommittees],
    api
  );
  const rrr33 = await getControllerAddressByStashAddress([...registrars], api);
  // let wqeo = api.query.
  console.log(res22);
  console.log(res);
  debugger;

  // debugger;
}

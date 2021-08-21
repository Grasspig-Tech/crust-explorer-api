import {ApiPromise} from '@polkadot/api';
import grantWs from '../../api/grant-ws';
import {SignedBlock} from '@polkadot/types/interfaces';
import {getBlockTimestamp} from '../../util';
test();

async function test() {
  // Construct
  // const wsProvider = new WsProvider('wss://api.decloudf.com/');
  const api: ApiPromise = await grantWs.connect('getBlock');
  // let res = await api.query.democracy.votingOf('5DvTCFuPUXb6Vzg5NB4mFu3Hz95GUqXTMLXib66e4KhF9wxW')
  const resss = await Promise.all([
    api.query.elections.voting(
      '5G4ch9r3xoxUUGoWLbTGJzke419FbkhoNCVTxotCQQALp8tw'
    ),
    api.query.elections.voting(
      '5CJ2GyPuBsvJ5xYv7ZmLcH25WXJKGFJPFN2dhFUcMNBo97ss'
    ),
    api.query.elections.voting(
      '5EJPtyWs9M3vEVGjcyjTMeGQEsnowwouZAUnFVUmdjJyPpBM'
    ),
    api.query.elections.voting(
      '5F9BYd21i2p6UL4j4CGZ6kFEBqnzyBuH6Tw6rGxhZsVg3e3q'
    ),
    api.query.democracy.votingOf(
      '5G4ch9r3xoxUUGoWLbTGJzke419FbkhoNCVTxotCQQALp8tw'
    ),
    api.query.democracy.votingOf(
      '5CJ2GyPuBsvJ5xYv7ZmLcH25WXJKGFJPFN2dhFUcMNBo97ss'
    ),
    api.query.democracy.votingOf(
      '5EJPtyWs9M3vEVGjcyjTMeGQEsnowwouZAUnFVUmdjJyPpBM'
    ),
    api.query.democracy.votingOf(
      '5F9BYd21i2p6UL4j4CGZ6kFEBqnzyBuH6Tw6rGxhZsVg3e3q'
    ),
  ]);
  const electionLock = Number(resss[0].stake) / 1e12;
  // let tmp = resss[5].toJSON().direct.votes.reduce((prev, cur) => prev + Number(cur[1].standard.balance), 0);
  console.log(resss);
  debugger;

  // debugger;
}

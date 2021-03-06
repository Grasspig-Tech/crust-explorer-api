import {ApiPromise} from '@polkadot/api';
import grantWs from '../../api/grant-ws';
import {SignedBlock} from '@polkadot/types/interfaces';
import {
  compare,
  filterRepeatData,
  getBlockTimestamp,
  getControllerAddressByStashAddress,
} from '../../util';
import {getLocks} from '../../util';
import got from 'got';
import {queryEras} from '../../api/era';
test();

async function test() {
  // Construct
  // const wsProvider = new WsProvider('wss://api.decloudf.com/');
  // debugger;
  const api: ApiPromise = await grantWs.connect('getBlock');
  // debugger;
  const wqeo = await api.query.swork.free();
  const pp = await api.query.swork.reportedFilesSize();
  // let pp2 = await api.query.market.filesSize();
  // debugger;
  const ttt: any = await queryEras({api});
  const SPLORER_API = 'https://splorer-api.crustcode.com/api'; // crust storage 存储 api
  const SPLORER_AUTHORIZATION = 'Basic Y3J1c3Q6MTYyNTM0'; // crust storage 存储 api 认证
  const rr44: any = await got.get(
    'https://splorer-api.crust.network/api/owners',
    {
      headers: {
        Authorization: 'Basic Y3J1c3Q6MTYyNTM0',
      },
      searchParams: {
        pageSize: 50000,
        pageIndex: 1,
      },
      responseType: 'json',
    }
  );
  const rr = await api.query.swork.groups.entries();

  const totall = 0;
  const tmppp1 = filterRepeatData;
  const tmppp2 = compare;

  const alll = rr
    .map(it => it[1].toJSON())
    .reduce((prev: any, cur: any) => [...prev, ...cur], []);
  const filterRepeatAll = filterRepeatData(alll);
  const rwae = await getControllerAddressByStashAddress(filterRepeatAll, api);
  //
  const address: any[] = [
    '5EtKPUiw6BuF8C7EDVVeCY5sAecm3w7vq4vrmgKHFQui7ozB',
    '5HhAKzsQ9wYq4dBoMvCXRmgoAxYQLzFj26VaZSLNquGBCHAi',
  ];
  const result = await api.queryMulti([
    ...(address as any).map((it: any) => [api.query.staking.bonded, it]),
  ]);
  // debugger;
  // let ii = await api.rpc.state.getKeys(rr[0][0])
  // let pp = await api.query.system.accounts.entries();
  // let rr = await api.rpc.state.getKeys(null, '0xd2bc339201fadf9be6f07cf9e525628ace24e3bdf50a84b694475f5928df819c')

  // console.log(oo)
  debugger;

  // debugger;
}

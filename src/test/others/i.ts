import {ApiPromise} from '@polkadot/api';
import grantWs from '../../api/grant-ws';
import {SignedBlock} from '@polkadot/types/interfaces';
import {
  filterRepeatData,
  getBlockTimestamp,
  compare,
  getControllerAddressByStashAddress,
} from '../../util';
import {getLocks} from '../../util';
import got from 'got';
import {queryEras} from '../../api/era';
test();

async function test() {
  // Construct
  const api: ApiPromise = await grantWs.connect('getBlock');
  const tmpFilterRepeatData = filterRepeatData;
  const tmpCompare = compare;
  const SPLORER_API = 'https://splorer-api.crustcode.com/api'; // crust storage 存储 api
  const SPLORER_AUTHORIZATION = 'Basic Y3J1c3Q6MTYyNTM0'; // crust storage 存储 api 认证
  const rr: any = await got.get(
    'https://splorer-api.crust.network/api/owners?pageSize=99999&pageIndex=1',
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
  debugger;
  const ttt: any = await queryEras({api});
  /*  */
  const allGroup = rr.body.data.data.reduce(
    (prev: any, cur: any) => [...prev, cur.stashId],
    []
  );
  /* 所有group owner的控制账户 */
  const allGroupController = rr.body.data.data.reduce(
    (prev: any, cur: any) => [...prev, cur.accountId],
    []
  );
  /* 节点数,去掉重复了的 */
  const nodes = tmpFilterRepeatData(
    rr.body.data.data.reduce(
      (prev: any, cur: any) => [
        ...prev,
        ...cur.member.map((it: any) => it.nodeId),
      ],
      []
    )
  );
  /* 所有节点数的控制账户 */
  const nodesControllId = (
    await getControllerAddressByStashAddress(nodes, api)
  ).filter(it => it);
  const alllll = tmpFilterRepeatData([
    ...nodesControllId,
    ...nodes,
    ...allGroup,
    ...allGroupController,
    ...ttt.response.accounts.map((it: any) => it.address),
  ]);
  const repeatNominators = tmpFilterRepeatData(
    ttt.response.nominators.map((it: any) => it.nominatorAddress)
  );
  /*  */
  const tmp1 = tmpFilterRepeatData([
    ...allGroup,
    ...ttt.response.bondedPledges.map((it: any) => it.accountAddress),
  ]);
  /* group Owner 和 验证人比较 */
  const tmp2 = tmpCompare(
    allGroup,
    ttt.response.bondedPledges.map((it: any) => it.accountAddress)
  );
  /* group Owner 和 提名人比较 */
  const tmp3 = tmpCompare(allGroup, repeatNominators);
  /* group Owner中既不是验证人，也不是提名人 */
  const tmp4 = allGroup.filter(
    (item: any) => ![...tmp2.common, ...tmp3.common].includes(item)
  );
  console.log(rr.body);
  // rr.body.data.data.reduce((prev: any, cur: any) => [...prev, ...cur.member.map((it: any) => it.nodeId)], [])
  const rr213 = await api.query.swork.groups.entries();
  const alll = rr213
    .map(it => it[1].toJSON())
    .reduce((prev: any, cur: any) => [...prev, ...cur], []);
  const filterRepeatAll = filterRepeatData(alll);

  // console.log(rr.body)
  // const api: ApiPromise = await grantWs.connect("getBlock");
  // let rr = await api.rpc.payment.queryInfo('0xf9c5707c309b4c3c975b8b014e24175935a3dc3e1fde5e5e2d16e56ccb748e36', '0x7fba87d04bbfe4e4f730605e866235c784ce3175f324397d924a26f5e69208d2');
  // let rr2 = await api.query.balances.account('5G4ch9r3xoxUUGoWLbTGJzke419FbkhoNCVTxotCQQALp8tw')
  // let awe = await api.query.balances.locks.entries()
  // let aa = await api.query.balances.totalIssuance().then(res => res.toString());
  // console.log(aa)
  debugger;

  // debugger;
}

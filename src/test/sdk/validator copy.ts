import {ApiPromise} from '@polkadot/api';
import grantWs from '../../api/grant-ws';

test();

async function test() {
  const api: ApiPromise = await grantWs.connect('getBlock');
  const as = await Promise.all([
    api.derive.accounts.info(
      '5CkJseQvawutZdkybh1Y85pvTS5CxrA6fbiKmWc8cyjo3K98'
    ),
    api.derive.accounts.flags(
      '5Ca6uxcasWB42eo1geVrg2cz7dHFhs9dfANbg9DhNsL673sF'
    ),
    api.derive.accounts.flags(
      '5GU67fpJTd3iWnmFAXA3TKjwxdMdju54HzrUDB3hLMPyoNtV'
    ),
    api.derive.accounts.idAndIndex(
      '5GU67fpJTd3iWnmFAXA3TKjwxdMdju54HzrUDB3hLMPyoNtV'
    ),
    api.derive.accounts.hasIdentity(
      '5GU67fpJTd3iWnmFAXA3TKjwxdMdju54HzrUDB3hLMPyoNtV'
    ),
    api.derive.accounts.idToIndex(
      '5GU67fpJTd3iWnmFAXA3TKjwxdMdju54HzrUDB3hLMPyoNtV'
    ),
    api.derive.accounts.identity(
      '5GU67fpJTd3iWnmFAXA3TKjwxdMdju54HzrUDB3hLMPyoNtV'
    ),
    api.derive.accounts.indexToId(
      '5GU67fpJTd3iWnmFAXA3TKjwxdMdju54HzrUDB3hLMPyoNtV'
    ),
    // api.derive.accounts.indexes("5GU67fpJTd3iWnmFAXA3TKjwxdMdju54HzrUDB3hLMPyoNtV"),
  ]);
  const ewqo = await api.derive.staking.waitingInfo();
  const ewqo22 = await api.derive.staking.overview();
  const ewqo33 = await api.derive.staking.validators();
  const valida = await api.query.staking.validators(
    '5DvTCFuPUXb6Vzg5NB4mFu3Hz95GUqXTMLXib66e4KhF9wxW'
  );
  debugger;
  const ewqo44 = await api.derive.staking.stashes();
  const era44 = await api.query.staking.activeEra();
  // let wqe = await api.query.staking.erasValidatorPrefs(era44, '5DvTCFuPUXb6Vzg5NB4mFu3Hz95GUqXTMLXib66e4KhF9wxW')
  console.log(as[3][0]?.toJSON());
  ewqo44.forEach(it => {
    console.log(it.toJSON());
  });
  debugger;
  const validatorAddresses: string[] = (
    await api.query.session.validators()
  ).toHuman() as string[];
  console.log(validatorAddresses[1]);
  const qweu = await api.query.staking.counterForValidators.entriesPaged;
  // let bb = await api.query.system.account(validatorAddresses[1])
  // let iii = await api.derive.accounts.info(validatorAddresses[1] as string)
  const bb = await api.query.system.account(
    '5CkJseQvawutZdkybh1Y85pvTS5CxrA6fbiKmWc8cyjo3K98'
  );
  const iii = await api.derive.accounts.info(
    '5CkJseQvawutZdkybh1Y85pvTS5CxrA6fbiKmWc8cyjo3K98' as string
  );
  console.log(bb);
  console.log(bb.toJSON());
  // api.query.session.validators.at()
  const ppo = await api.query.session.disabledValidators();
  // let tquwqu = await api.query.session.validators.entries(['5HbGVzYxsKVyWeUEfRJLHe9VDiJ8grAt4QYsxnMH24ANDwBU'])
  // let qia = await api.query.session.validators.entriesPaged({ pageSize: 10, args: ['5HbGVzYxsKVyWeUEfRJLHe9VDiJ8grAt4QYsxnMH24ANDwBU'] })
  // console.log(qia)
  console.log(ppo);
  console.log(ppo?.toJSON());
  debugger;
}

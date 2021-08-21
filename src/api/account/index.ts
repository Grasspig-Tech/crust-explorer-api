// 入口
import {ApiPromise} from '@polkadot/api';
import {AccountArg} from '../../interface';
import {getLocks, trillionCruFormat, getAccountDisplay} from '../../util';
import {CeAccount} from '../../model';
// eslint-disable-next-line node/no-unpublished-import
import {AccountInfo} from '@polkadot/types/interfaces';

/**
 * @param accounts
 * @param api
 * @returns
 */
export async function queryAccount(
  accounts: AccountArg[],
  api: ApiPromise
): Promise<CeAccount[]> {
  // debugger;
  // let accountInfo = await api.derive.accounts.info(accountAddress);
  const accountsMapToQueryMutlti = accounts.map(it => {
    return [api.query.system.account, it.address];
  });
  const accountDisplayArgs = accounts.map(it => ({address: it.address}));
  const queryRes = await Promise.all([
    api.queryMulti(accountsMapToQueryMutlti as any),
    getAccountDisplay(accountDisplayArgs, api),
    getLocks(
      accounts.map(it => it.address),
      api
    ),
  ]);

  const accountDisplays = queryRes[1];
  const accountsInfo: AccountInfo[] = queryRes[0] as AccountInfo[];
  // debugger;
  const res: CeAccount[] = accountsInfo.map(
    (it: AccountInfo, curIndex: number) => {
      const data = it.data.toJSON();
      const free: any = Number(data.free); //余额，加上保留的就是总余额
      const reserved: any = Number(data.reserved); //保留
      const feeFrozen: any = Number(data.feeFrozen); //冻结金额
      return {
        nonce: it.nonce.toJSON(),
        balance: trillionCruFormat(free + reserved),
        balanceLock: trillionCruFormat(queryRes[2].stakingLock[curIndex]),
        bonded: trillionCruFormat(feeFrozen),
        reserved: trillionCruFormat(reserved),
        democracyLock: trillionCruFormat(queryRes[2].democracyLock[curIndex]),
        electionLock: trillionCruFormat(queryRes[2].electionLock[curIndex]),
        unbonding: '0',
        address: accounts[curIndex].address,
        display: accountDisplays[curIndex].display as any,
        accountDisplay: JSON.stringify(accountDisplays[curIndex]),
        judgements: JSON.stringify(accountDisplays[curIndex].judgements),
        // role: accounts[curIndex].role as number,
        accountType: accounts[curIndex].accountType,
        email: accountDisplays[curIndex].email as any,
        twitter: accountDisplays[curIndex].twitter as any,
        web: accountDisplays[curIndex].web as any,
        isCouncilMember: accounts[curIndex].isCouncilMember ? 1 : 0,
        isEvmContract: accounts[curIndex].isEvmContract ? 1 : 0,
        isRegistrar: accounts[curIndex].isRegistrar ? 1 : 0,
        isTechcommMember: accounts[curIndex].isTechcommMember ? 1 : 0,
        legal: accountDisplays[curIndex].legal as any,
      };
    }
  );

  return res;
}

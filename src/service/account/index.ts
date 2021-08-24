import {queryAccount} from '../../api/account';
import {AccountArg} from '../../interface';
/**
 * 通过区块头获取区块，支持多个
 *
 * @export
 */
export async function getAccounts(accounts: AccountArg[]) {
  return await queryAccount(accounts)
    .then(res => {
      return res;
    })
    .catch(err => {
      throw err;
    });
}

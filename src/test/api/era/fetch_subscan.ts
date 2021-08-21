import {ApiPromise} from '@polkadot/api';
import grantWs from '../../../api/grant-ws';
import got, {OptionsOfTextResponseBody} from 'got';
main();
async function main() {
  const api: ApiPromise = await grantWs.connect('aa');
  const validatorAddresses: string[] = (
    await api.query.session.validators()
  ).toHuman() as string[];
  const total = [];
  for (let i = 0; i < 8; i++) {
    const pAll = validatorAddresses.map(it => {
      return got.post('https://crust.subscan.io/api/scan/staking/era_stat', {
        json: {row: 100, page: i, address: it},
        responseType: 'json',
      });
    });
    let res = await Promise.all(pAll);
    res = res
      .map((it: any) => {
        return it.body.data.list.map(
          ({era, Id, start_block_num, end_block_num}: any) => ({
            era,
            Id,
            start_block_num,
            end_block_num,
          })
        );
      })
      .reduce((prev, cur) => [...prev, ...cur], []);
    total.push(...res);
  }
  debugger;
  let res: any = [];
  res = total.filter((it: any) => {
    if (res.find((item: any) => item.era === it.era)) {
      return false;
    }
    return true;
  });
  res.sort((a: any, b: any) => a.era - b.era);
  console.log(total);
  debugger;
}

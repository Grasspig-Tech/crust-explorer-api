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
  const aaa = [
    '5CfZd2ZYFStBZMAssqnXNcDG27wrE5y4jesYiaQm9ZHKtSje',
    '5HbkaXh28HKQVfbmXz8bXdtwrC5UANKauPfjk5EhXvijHHLZ',
    '5DyqyARqUe3qmdn6sMu4RQ4SMh5Q5x3WznURCSX1t5dfsNYx',
    '5EJRyx4THVvVUtNAn6uY2Mccp4cUEdkV8JMeTJbawTMNyPJG',
    '5GRgqFeYuDuVERA6gnKMmjtMhfGPrAat4NyQfaUAKM6krzAD',
    '5C55NDbMtPwJUnv18D99T4FCHH3aWnhpD7Mb3EsCLoTZ9KE4',
    '5CDMUPXV6PYEnjRBseFbPZPgZstSYLU1njrHUtPnUa3PXsX8',
    '5CSNCUUsJdQLZnc2zNEVuBaGN5pu2D6iCzn6MerFj73Bqc9f',
    '5CXgjXAxdvTbnmJEJdd9aYhqcpLML7EWfT8oAEKCUWC6TvG2',
    '5DvmpcLBPL31eeVM9R23XXha8vEaqF49VNjtVca4K8NsqYdT',
    '5E1betP1xNmHomhhbSbzULaFahQe2sfqvS3XFgyoMUwWo6SU',
    '5E1reUXGojkQQfPcNLwXFktJiBXticY8wkAzfujjhbygEzaT',
    '5E9hFWBzHKH3q5pQ58KtWn7pjKj1cfcAk21bbBhdbizESYGs',
    '5ERiYa7ggf7YbSzbX3HviGjzJMCtm5GQxzGubd4MG31oV7dp',
    '5EqXPAxgrc2rWn9EHVoFbFu8PZTxsjSb2Gbkcprg5N64MQhp',
    '5F9qCQ2mkvBSgpsmTNt7yr8suKQCv2j6SZvCmFErSDR9o1H1',
    '5F9z2qKweLXxLGdLJ4sYCtHnegA4kQnoNh6SCmzqwkQx9M2D',
    '5FNxZQaXmr3gbKBemJsdMdoB9jSiMvT8kuWKGqVUXtnaQXrL',
    '5FYeo84oAYTAgK8c6UqRJv7DCda1u31aFd6M25U6D1iL6aWQ',
    '5FhiAbVpJkE94DGNofUzDc6ScRgZyZa19D6f7rtrCthf3kQg',
    '5FjQ5n5Fa5ZsLKrXNQKJtdRKVpZL7x5tuKuqF6zqDpRDHWWs',
    '5G17fKgAiJ4zeX1VReJFwukRceMqLNMjePEjftuTV41a4N3D',
    '5GENDtCJF67zDQkiPVmVHGdnjVJJv9euR2pemkLDPw2A3CaB',
    '5GYSxHtfcgW7HGhiDxiTv8TGMbRLRoa3EWVFTvcbTtM5tPVa',
    '5GvEjPt9v7LENHCVVCxzVEEu1umKKte7RLRGdzU9EeymKspc',
    '5HBUhGUMMJV67T6t8UsQKkb1wFe1EQmqNhKuX3DhvDpdE6wh',
    '5HGkTDmAE7WbsjQjLitVHSjeUkKWswg7hiDnYDAEfRHPQCPj',
    '5HbaU2fGJnUL56CtJTFNkPdiA8Zqp1F75r3s3T7du12gVXEW',
    '5CV6LFAY1ZRpx81jM48cBRAFJTyNGSh4fkTVnwp39TvG5kqR',
    '5CtzwQutNTCn4XaXCBJAgtcSjoVaQdN7AW6QRHKwJUFfjKJf',
    '5D2uPeZuj3Kpi9M44ghtGGqHaEq2eoUjSgzWp6oXr2XEtTV9',
    '5EJLLqfCJ1SuLgbVq4NPUAqbxWHon6dX3gwU8C4bvLx5tLnF',
    '5EnLDDkvtEeVZF97XHCdcdSzg6uRPGuas4u3H4DhvextjwBh',
    '5F1qGfnDTezCBcoDNLhQ5v4bvchW7GUinkjuRWxUQWir8Rws',
    '5FFNcLtHGPjEwjyXRLvGnQhDXrTcM7xWX9c453EnAmNNWyNQ',
    '5FxutSak7ErAhbY14BYJ3acUK79otL792F38o8YUHEd7ojFb',
    '5GE5F7LpVKQgsUvhu5iFG37m1wvDTH8XBHMNYuGaVE9ZV8fa',
    '5GRGkVYd3e5fa2XQS3yDMHvDtceqz4h8sCwdNQWQGWA5Bneq',
    '5GeS9pNz5aNTtNcr6YL2kAV2qvJrVpgyJ4sJUerWXSCtzTSK',
    '5Gk3nP9NBRH3yaDEWnzG2WjqQj3e5g5KU1D6zWwBRdaPDi8p',
    '5GnC1fehVnSAXV6smwfHcgEUbczomi65ND6oFjSDrSAWaqQL',
    '5H3WqLJpNo5XcoXqeQvUW7TZzSqtCuDwHh5ZafHnD1BKsQJo',
    '5H6sXZbFLR4XjeoeTy9PL3opeG9hzKdi7UJkGAGhbABKqvhS',
    '5HK4nfHdZaQshFvEfrc9C24PSB6gCtSLxADk5KdtK9z1SKij',
    '5HW4zEk1xxmCK6tvKpoErhHVBZtD3ZDWn7jGb6xcCEPWe95Y',
  ];

  const wqe = await api.queryMulti([
    ...(aaa as any).map((it: any) => [api.query.staking.bonded, it]),
  ]);
  console.log(wqe);
  debugger;

  // debugger;
}

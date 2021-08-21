import {Status} from '../interface';

export interface CeTransfer {
  id?: number;
  amount: string;
  asset_symbol: string;
  eventIndex: string;
  // eventHash: string,
  extrinsicIndex: string;
  hash: string; //交易hash
  blockNum: number;
  blockTimestamp: number;
  module: string;
  from: string;
  to: string;
  fee: string;
  nonce: number;
  finalized: Status;
  eventSort: string;
  success: Status;
}

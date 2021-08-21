import {Status} from '../interface';

export interface CeExtrinsic {
  id?: number;
  lifetime: string;
  params: string;
  extrinsicIdx: number;
  extrinsicIndex: string;
  extrinsicHash: string;

  blockHash: string;
  blockNum: number;
  blockTimestamp: number;
  callModule: string;
  callModuleFunction: string;
  accountId: string;
  accountDisplay: string;
  fee: string;
  finalized: Status;
  signed: Status;
  nonce: number;
  signature: string;
  transfer: string;
  success: Status;
  extrinsicSort: string;
}

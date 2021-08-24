import {Status} from '../interface';

export interface CeBlock {
  id?: number;
  finalized: Status;
  blockNum: number; // 区块高度
  blockTimestamp: number;
  hash: string;
  parentHash: string;
  eventCount: number;
  extrinsicsCount: number;
  stateRoot: string;
  extrinsicsRoot: string;
  specVersion: number;
  validator: string;
  accountDisplay: string;
}

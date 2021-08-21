import {Status} from '../interface';

export interface CeRewardSlash {
  id?: number;
  params: string;
  extrinsicIdx: number;
  extrinsicHash: string;
  blockNum: number;
  blockTimestamp: number;
  eventId: string;
  eventIdx: number;
  eventIndex: string;
  validatorStash: string;
  moduleId: string;
  amount: string;
  accountId: string;
  eventSort: string;
  success: Status;
  finalized: Status;
}

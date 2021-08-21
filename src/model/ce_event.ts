import {Status} from '../interface';

export interface CeEvent {
  id?: number;
  blockNum: number;
  blockTimestamp: number;
  eventId: string;
  eventIdx: number;
  eventIndex: string;
  // eventHash:string,
  extrinsicHash: string;
  extrinsicIdx: number;
  extrinsicIndex: string;
  finalized: Status;
  type: string;
  moduleId: string;
  params: string;
  eventSort: string;
  success: Status;
}

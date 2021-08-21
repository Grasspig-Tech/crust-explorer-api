import {Status} from '../interface';

export interface CeNetworkOverview {
  id?: number;
  era: number;
  eraStartTimestamp: number;
  totalStorage: string;
  totalCirculation: string;
  totalOutputLast24?: string;
  blockHeight?: string;
  blockHeightConfirmed?: string;
  blockLastTime?: string;
  pledgeMinimum?: string;
  pledgeAvg?: string;
  pledgePer: string;
  pledgeTotalActive?: string;
  pledgeAbleNum?: string;
  countdownEra?: string;
  countdownSession?: string;
  rateFlow?: string;
  rateInflation?: string;
  baseFee?: string;
  accountHold?: number;
  numberGuarantee?: number;
  numberValidator?: number;
  numberTransfer?: number;
  numberTrade?: number;
  status?: Status;
}

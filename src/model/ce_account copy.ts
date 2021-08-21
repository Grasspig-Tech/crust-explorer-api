export interface CeAccount {
  id?: number;
  accountType: number;
  address: string;
  display: string; //区块高度
  accountDisplay: string;
  judgements: string;
  balance: number;
  balanceLock: number;
  bonded: number;
  reserved: number;
  democracyLock: number;
  electionLock: number;
  unbonding: number;
  role: number;
  nonce: number;
}

export interface CeBondedPledge {
  id?: number;
  era: number;
  accountAddress: string;
  bondedNominators: string;
  bondedOwner: string;
  ownerActivePledge: string;
  otherActivePledge: string;
  pledgeMax: string;
  pledgeTotal: string;
  score: number;
  guaranteeFee: string;
}

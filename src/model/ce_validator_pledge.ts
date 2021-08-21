export interface CeValidatorPledge {
  id?: number;
  era: number;
  role: number;
  rankValidator: number;
  bondedNominators: string;
  bondedOwner: string;
  countNominators: number;
  grandpaVote: number;
  sessionKey: string;
  latestMining: string;
  rewardPoint: string;
  accountAddress: string;
  controllerAccountAddress: string;
  stashAccountDisplay: string;
  controllerAccountDisplay: string;
  validatorPrefsValue: string;
  ownerActivePledge: string;
  otherActivePledge: string;
  pledgeMax: string;
  pledgeTotal: string;
  score: string;
}

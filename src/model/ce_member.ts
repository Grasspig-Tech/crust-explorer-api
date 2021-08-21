import {Role} from '../interface';

export interface CeMember {
  id?: number;
  era: number;
  role: Role; //1验证人 2候选验证人 3提名人
  memberRank: number;
  countNominators: number;
  grandpaVote: number;
  sessionKey: string;
  latestMining: number;
  rewardPoint: number;
  accountAddress: string;
  controllerAccountAddress: string;
  accountDisplay: string;
  controllerAccountDisplay: string;
}

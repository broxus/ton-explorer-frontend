/* tslint:disable */
import { ElectionStakeItem } from './election-stake-item';
export interface TotalStakeListItem {
  electionId: number;
  stakes?: Array<ElectionStakeItem>;
  totalStake: string;
  totalWeight: string;
}

/* tslint:disable */
import { AccountId } from './account-id';
export interface StakeTransactionCountRequest {
  account?: AccountId;
  electionTime?: number;
  fromTs?: number;
  toTs?: number;
}

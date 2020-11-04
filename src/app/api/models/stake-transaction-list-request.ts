/* tslint:disable */
import { AccountId } from './account-id';
export interface StakeTransactionListRequest {
  account?: AccountId;
  electionTime?: number;
  fromTs?: number;
  limit: number;
  offset: number;
  toTs?: number;
}

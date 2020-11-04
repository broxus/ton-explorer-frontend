/* tslint:disable */
import { AccountId } from './account-id';
export interface TransactionsRequest {
  account?: AccountId;
  excludeAccounts?: Array<AccountId>;
  fromTs?: number;
  limit: number;
  offset: number;
  toTs?: number;
  transactionTypes?: Array<string>;
}

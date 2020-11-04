/* tslint:disable */
import { AccountId } from './account-id';
export interface TransactionsCountRequest {
  account?: AccountId;
  excludeAccounts?: Array<AccountId>;
  fromTs?: number;
  toTs?: number;
  transactionTypes?: Array<string>;
}

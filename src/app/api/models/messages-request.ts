/* tslint:disable */
import { AccountId } from './account-id';
export interface MessagesRequest {
  account?: AccountId;
  excludeAccounts?: Array<AccountId>;
  fromTs?: number;
  limit: number;
  offset: number;
  toTs?: number;
}

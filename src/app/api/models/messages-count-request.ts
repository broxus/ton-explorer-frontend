/* tslint:disable */
import { AccountId } from './account-id';
export interface MessagesCountRequest {
  account?: AccountId;
  excludeAccounts?: Array<AccountId>;
  fromTs?: number;
  out?: boolean;
  toTs?: number;
}

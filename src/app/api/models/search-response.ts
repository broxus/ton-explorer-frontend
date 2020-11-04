/* tslint:disable */
import { Account } from './account';
import { AccountId } from './account-id';
import { BlockListItem } from './block-list-item';
import { SearchResponseMessageItem } from './search-response-message-item';
import { TransactionListItem } from './transaction-list-item';
export interface SearchResponse {
  accounts?: Array<Account>;
  blocks?: Array<BlockListItem>;
  messages?: Array<SearchResponseMessageItem>;
  transaction?: TransactionListItem;
  validator?: AccountId;
}

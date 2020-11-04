/* tslint:disable */
import { BlockListItem } from './block-list-item';
import { MessageListItem } from './message-list-item';
import { TransactionListItem } from './transaction-list-item';
export interface SearchResponseMessageItem {
  block: BlockListItem;
  message: MessageListItem;
  transaction: TransactionListItem;
}

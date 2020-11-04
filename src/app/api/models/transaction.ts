/* tslint:disable */
import { BlockIdExt } from './block-id-ext';
import { HashUpdate } from './hash-update';
import { Message } from './message';
import { TransactionDescription } from './transaction-description';
export interface Transaction {
  account: string;
  blockId?: BlockIdExt;
  description: TransactionDescription;
  endStatus: string;
  hash: string;
  hashUpdate: HashUpdate;
  lt: string;
  messageIn?: Message;
  messagesOut?: Array<Message>;
  now: number;
  originalStatus: string;
  outMessageCount: number;
  prevTransHash: string;
  prevTransLt: string;
  totalFees: string;
  workchain: number;
}

/* tslint:disable */
import { InternalTransactionId } from './internal-transaction-id';
export interface AccountTransactionsRequest {
  account: string;
  count: number;
  from?: InternalTransactionId;
}

/* tslint:disable */
export interface StakeTransactionListItem {
  accountAddress: string;
  accountWorkchain: number;
  adnl?: string;
  electionTime?: number;
  electorAccountId: string;
  electorWorkchain: number;
  maxFactor?: number;
  publicKey?: string;
  time: number;
  transactionHash: string;
  transactionLt: number;
  transactionType: string;
  value: string;
}

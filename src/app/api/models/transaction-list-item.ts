/* tslint:disable */
export interface TransactionListItem {
  aborted?: boolean;
  accountId: string;
  balanceChange: string;
  blockSeqno: number;
  blockShard: string;
  creditFirst?: boolean;
  destroyed?: boolean;
  dueFeesCollected?: string;
  fwdFees?: string;
  gasFees?: string;
  hash: string;
  isTock?: boolean;
  lt: string;
  msgFees?: string;
  reqFwdFees?: string;
  storageFeesCollected?: string;
  storageFeesDue?: string;
  time: number;
  totalActionFees?: string;
  totalFees: string;
  totalFwdFees?: string;
  transactionType: string;
  workchain: number;
}

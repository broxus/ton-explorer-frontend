/* tslint:disable */
import { StorageUsed } from './storage-used';
export interface TransactionBouncePhase {
  fwdFees?: string;
  kind: string;
  msgFees?: string;
  msgSize?: StorageUsed;
  reqFwdFees?: string;
}

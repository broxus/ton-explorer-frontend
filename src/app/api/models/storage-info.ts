/* tslint:disable */
import { StorageUsed } from './storage-used';
export interface StorageInfo {
  duePayment?: string;
  lastPaid: number;
  storageUsed: StorageUsed;
}

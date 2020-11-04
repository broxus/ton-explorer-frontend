/* tslint:disable */
import { StorageUsed } from './storage-used';
export interface TransactionActionPhase {
  actionListHash: string;
  messagesCreated: number;
  noFunds: boolean;
  resultArg?: number;
  resultCode: number;
  skippedActions: number;
  specialActions: number;
  statusChange: string;
  success: boolean;
  totalActionFees?: string;
  totalActions: number;
  totalFwdFees?: string;
  totalMsgSize: StorageUsed;
  valid: boolean;
}

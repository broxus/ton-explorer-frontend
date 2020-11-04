/* tslint:disable */
import { TransactionActionPhase } from './transaction-action-phase';
import { TransactionAdditionalInfo } from './transaction-additional-info';
import { TransactionBouncePhase } from './transaction-bounce-phase';
import { TransactionComputePhase } from './transaction-compute-phase';
import { TransactionCreditPhase } from './transaction-credit-phase';
import { TransactionStoragePhase } from './transaction-storage-phase';
export interface TransactionDescription {
  aborted?: boolean;
  action?: TransactionActionPhase;
  additionalInfo?: TransactionAdditionalInfo;
  bounce?: TransactionBouncePhase;
  computePhase?: TransactionComputePhase;
  creditFirst?: boolean;
  creditPhase?: TransactionCreditPhase;
  destroyed?: boolean;
  installed?: boolean;
  isTock?: boolean;
  kind: string;
  storagePhase?: TransactionStoragePhase;
}

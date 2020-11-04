/* tslint:disable */
export interface TransactionComputePhase {
  accountActivated?: boolean;
  exitArg?: number;
  exitCode?: number;
  gasCredit?: string;
  gasFees?: string;
  gasLimit?: string;
  gasUsed?: string;
  kind: string;
  mode?: number;
  msgStateUsed?: boolean;
  reason?: number;
  success?: boolean;
  vmFinalStateHash?: string;
  vmInitStateHash?: string;
  vmSteps?: number;
}

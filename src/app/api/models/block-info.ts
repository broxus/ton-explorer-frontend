/* tslint:disable */
import { ExtBlockRef } from './ext-block-ref';
import { GlobalVersion } from './global-version';
export interface BlockInfo {
  afterMerge: boolean;
  afterSplit: boolean;
  beforeSplit: boolean;
  endLt: string;
  flags: number;
  genCatchainSeqno: number;
  genSoftware: GlobalVersion;
  genUtime: number;
  genValidatorListHashShort: number;
  keyBlock: boolean;
  masterRef?: ExtBlockRef;
  minRefMcSeqno: number;
  notMaster: boolean;
  prevKeyBlockSeqno: number;
  seqno: number;
  startLt: string;
  version: number;
  vertSeqno: number;
  vertSeqnoIncr: boolean;
  wantMerge: boolean;
  wantSplit: boolean;
}

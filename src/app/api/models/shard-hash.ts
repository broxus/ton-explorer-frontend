/* tslint:disable */
import { BlockIdExt } from './block-id-ext';
export interface ShardHash {
  beforeMerge: boolean;
  beforeSplit: boolean;
  endLt: string;
  feesCollected: string;
  fundsCollected: string;
  genUtime: number;
  id: string;
  minRefMcSeqno: number;
  nextCatchainSeqno: number;
  nextValidatorShard: string;
  startLt: string;
  topBlockId: BlockIdExt;
  wantMerge: boolean;
  wantSplit: boolean;
  workchain: number;
}

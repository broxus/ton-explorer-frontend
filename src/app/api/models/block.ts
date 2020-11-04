/* tslint:disable */
import { BlockExtra } from './block-extra';
import { BlockId } from './block-id';
import { BlockIdExt } from './block-id-ext';
import { BlockInfo } from './block-info';
import { Transaction } from './transaction';
import { ValueFlow } from './value-flow';
export interface Block {
  blockExtra: BlockExtra;
  globalId: number;
  id: BlockIdExt;
  info: BlockInfo;
  masterchainId: BlockIdExt;
  next?: Array<BlockId>;
  previous?: Array<BlockIdExt>;
  transactions?: Array<Transaction>;
  valueFlow: ValueFlow;
}

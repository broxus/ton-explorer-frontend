/* tslint:disable */
import { HashUpdate } from './hash-update';
export interface BlockExtraAccount {
  addr: string;
  stateUpdate: HashUpdate;
  transactionCount: number;
}

/* tslint:disable */
import { BlockExtraAccount } from './block-extra-account';
import { McBlockExtra } from './mc-block-extra';
export interface BlockExtra {
  accounts?: Array<BlockExtraAccount>;
  createdBy: string;
  custom?: McBlockExtra;
  randSeed: string;
}

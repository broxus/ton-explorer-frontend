/* tslint:disable */
import { CurrencyCollection } from './currency-collection';
export interface ValueFlow {
  created: CurrencyCollection;
  exported: CurrencyCollection;
  feesCollected: CurrencyCollection;
  feesImported: CurrencyCollection;
  fromPrevBlk: CurrencyCollection;
  imported: CurrencyCollection;
  minted: CurrencyCollection;
  recovered: CurrencyCollection;
  toNextBlk: CurrencyCollection;
}

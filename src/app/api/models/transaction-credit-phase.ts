/* tslint:disable */
import { CurrencyCollection } from './currency-collection';
export interface TransactionCreditPhase {
  credit: CurrencyCollection;
  dueFeesCollected?: string;
}

/* tslint:disable */
import { Account } from './account';
import { CurrencyCollection } from './currency-collection';
export interface BlockState {
  accounts?: Array<Account>;
  globalBalance?: CurrencyCollection;
  lt: string;
  totalBalance?: CurrencyCollection;
  totalValidatorFees?: CurrencyCollection;
  utime: number;
}

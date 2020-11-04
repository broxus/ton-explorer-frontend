/* tslint:disable */
import { AccountState } from './account-state';
import { CurrencyCollection } from './currency-collection';
import { InternalTransactionId } from './internal-transaction-id';
import { StorageInfo } from './storage-info';
export interface Account {
  addressBase64Bounceable: string;
  addressBase64NonBounceable: string;
  addressHex: string;
  balance?: CurrencyCollection;
  lastTransactionId: InternalTransactionId;
  state: AccountState;
  storageStat: StorageInfo;
  workchain: number;
}

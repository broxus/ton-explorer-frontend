import {PastElectionListItem} from './api/models/past-election-list-item';
import {StakeTransactionListItem} from './api/models/stake-transaction-list-item';

export type SelectedSet =
  | 'previous'
  | 'current'
  | 'next';

export type ElectionsStatus =
  | 'waiting'
  | 'open'
  | 'closed';

export type UtimeToSelectedSet = { [P in number]: SelectedSet };
export type SelectedSetStats = { [P in SelectedSet]: PastElectionListItem };
export type ElectionsStatuses = { [P in SelectedSet]: ElectionsStatus };
export type Participants = { [P in SelectedSet]: Map<string, StakeTransactionListItem> };

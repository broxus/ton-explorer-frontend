/* tslint:disable */
import { ConfigValidatorsQuantityLimits } from './config-validators-quantity-limits';
import { ConfigValidatorsStakeLimits } from './config-validators-stake-limits';
import { ConfigValidatorsTimings } from './config-validators-timings';
import { StakeTransactionListItem } from './stake-transaction-list-item';
import { ValidatorSet } from './validator-set';
export interface ValidatorsState {
  current?: ValidatorSet;
  currentStakes?: Array<StakeTransactionListItem>;
  next?: ValidatorSet;
  nextStakes?: Array<StakeTransactionListItem>;
  previous?: ValidatorSet;
  previousStakes?: Array<StakeTransactionListItem>;
  quantityLimits?: ConfigValidatorsQuantityLimits;
  stakeLimits?: ConfigValidatorsStakeLimits;
  timings?: ConfigValidatorsTimings;
}

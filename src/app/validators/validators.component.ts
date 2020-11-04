import {Component, Input} from '@angular/core';
import {BigNumber} from 'bignumber.js';

import {ValidatorSet} from '../api/models/validator-set';
import {PastElectionListItem} from '../api/models/past-election-list-item';
import {Validator} from '../api/models/validator';
import {StakeTransactionListItem} from '../api/models/stake-transaction-list-item';

import namedAddresses from '../named-addresses';

@Component({
  selector: 'app-validators',
  templateUrl: './validators.component.html',
  styleUrls: ['./validators.component.scss']
})
export class ValidatorsComponent {

  @Input() validatorSet: ValidatorSet | null;
  @Input() electionsStats: PastElectionListItem | null;
  @Input() participants: Map<string, StakeTransactionListItem> | null;
  @Input() pageSize = 10;
  @Input() showHeader = false;

  namedAddresses = namedAddresses;

  computeWeight(item: Validator): BigNumber {
    return new BigNumber(item.weight).div(this.validatorSet.totalWeight);
  }

  computeStake(item: Validator): BigNumber {
    return this.computeWeight(item).mul(this.electionsStats.totalStake).round(0, BigNumber.ROUND_HALF_EVEN);
  }

  computeBonuses(item: Validator): BigNumber {
    return this.computeWeight(item).mul(this.electionsStats.totalBonuses).round(0, BigNumber.ROUND_HALF_EVEN);
  }
}

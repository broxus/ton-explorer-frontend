import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Subscription} from 'rxjs';
import {Account} from '../api/models/account';
import {ApiService} from '../api/services/api.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Title} from '@angular/platform-browser';
import {TranslateService} from '@ngx-translate/core';
import {StakeTransactionListItem} from '../api/models/stake-transaction-list-item';
import {ValidatorsState} from '../api/models/validators-state';
import BigNumber from 'bignumber.js';
import {TotalStakeListItem} from '../api/models/total-stake-list-item';
import {Validator} from '../api/models/validator';
import {ValidatorSet} from '../api/models/validator-set';
import {PastElectionListItem} from '../api/models/past-election-list-item';
import download from 'downloadjs';

class ValueByTimestamp {
  timestamp: number;
  value: BigNumber;
}

class CalculationResultItem {
  part: number;
  time: number;
  electionTime: number;
  transactionHash: string;
  startValue: BigNumber;
  profit: BigNumber;
  endValue: BigNumber;
}

@Component({
  selector: 'app-validator-page',
  templateUrl: './validator-page.component.html',
  styleUrls: ['./validator-page.component.scss']
})
export class ValidatorPageComponent implements OnInit, OnDestroy {

  isReady: boolean;

  private langSubscription: Subscription;
  private routeParamsSubscription?: Subscription;

  currentLang: string;

  id: string;
  error: number | undefined;
  account: Account;
  stakeTransactions: StakeTransactionListItem[];
  validatorsState: ValidatorsState;
  totalStakes: { [key: number]: TotalStakeListItem } = {};

  currentRank: number;
  currentValidator: Validator;
  previousValidator: Validator;
  nextValidator: Validator;

  addressesBase64Open = false;

  recoverTransactions: StakeTransactionListItem[] = [];

  recoveredStakes: { [key: string]: StakeTransactionListItem[] } = {};
  mergedRecovers: { [key: string]: StakeTransactionListItem[] } = {};
  electionTimes: { [key: string]: number[] } = {};
  unaccountedAmmounts: { [key: string]: BigNumber } = {};
  calculationErrorItems: { [key: string]: StakeTransactionListItem[] } = {};
  calculationErrors: { [key: string]: BigNumber } = {};
  unfrozenStakeAmounts: { [key: string]: BigNumber } = {};
  recoverValues: { [key: string]: BigNumber } = {};
  recoverProfits: { [key: string]: BigNumber } = {};
  recoverProfitsPercents: { [key: string]: BigNumber } = {};
  totalProfits: ValueByTimestamp[] = [];

  nextElectionsStats: PastElectionListItem;
  currentElectionsStats: PastElectionListItem;
  previousElectionsStats: PastElectionListItem;

  previousProfitPercent: BigNumber;
  currentProfitPercent: BigNumber;

  alphas = 'abcdefghijklmnopqrstuvwxyz';

  profitabilityPageSize = 10;
  profitabilityPage = 1;

  calculationParams = {
    delegatedAmount: 1000,
    calculateFrom: new Date(),
    calculateTo: new Date()
  };
  calculationStartValue: BigNumber;
  calculationTotalProfit: BigNumber;
  calculationTotalProfitPercent: BigNumber;
  calculationFirstStake: StakeTransactionListItem;
  calculationSecondStake: StakeTransactionListItem;
  calculationResults: CalculationResultItem[];
  calculationLatestRecovers: number[] = [];
  calculatorFormErrors: {[key: string]: string[]} = {};
  showAllCalculations = false;

  @ViewChild('main') main: ElementRef;
  @ViewChild('elections') elections: ElementRef;
  @ViewChild('stakeEvents') stakeEvents: ElementRef;
  @ViewChild('profitability') profitability: ElementRef;
  @ViewChild('calculator') calculator: ElementRef;

  constructor(private apiService: ApiService,
              private route: ActivatedRoute,
              private router: Router,
              private titleService: Title,
              private translateService: TranslateService) {
  }

  ngOnInit(): void {
    this.initSubscription();
  }

  initSubscription() {
    if (this.routeParamsSubscription) {
      this.routeParamsSubscription.unsubscribe();
    }
    this.routeParamsSubscription = this.route.paramMap.subscribe(paramsMap => {
      this.id = paramsMap.get('id');
      if (this.id) {
        delete this.error;
        this.isReady = false;
        this.loadData();
      } else {
        this.error = 404;
      }
    });
  }

  loadData() {

    this.apiService.postApiAccount({body: {id: this.id}}).toPromise().then(account => {
      this.account = account;
      Promise.all([
        this.apiService.getApiValidatorsState().toPromise(),
        this.apiService.postApiStakeTransactionsTotalStakes({
          body: {
            address: `${account.workchain}:${account.addressHex}`
          }
        }).toPromise(),
        this.apiService.postApiStakeTransactionList({
          body: {
            account: {
              workchain: account.workchain,
              address: account.addressHex
            },
            limit: 10000,
            offset: 0
          }
        }).toPromise(),
        this.apiService.getApiValidatorsPastElections().toPromise()
      ]).then(([validatorsStake, totalStakes, stakeTransactions, pastElections]) => {
        this.validatorsState = validatorsStake;
        this.totalStakes = totalStakes.reduce((s, item) => {
          s[item.electionId] = item;
          return s;
        }, {});
        this.stakeTransactions = stakeTransactions.sort((a, b) => a.time - b.time);

        if (this.validatorsState.current) {
          this.currentElectionsStats = pastElections.find(e => e.electionId === this.validatorsState.current.utimeSince);
          const stake = this.stakeTransactions.find(e => e.electionTime === this.validatorsState.current.utimeSince);
          if (stake) {
            this.currentRank = this.validatorsState.current.list.findIndex(e => e.publicKey === stake.publicKey);
            if (this.currentRank === -1) {
              delete this.currentRank;
            } else {
              this.currentRank = this.currentRank + 1;
              this.currentValidator = this.validatorsState.current.list.find(e => e.publicKey === stake.publicKey);
            }
          }
          if (this.currentValidator && this.currentElectionsStats) {
            const b = this.computeBonuses(
              this.currentValidator,
              this.validatorsState.current,
              this.currentElectionsStats);
            const s = this.computeStake(
              this.currentValidator,
              this.validatorsState.current,
              this.currentElectionsStats);
            this.currentProfitPercent = b.div(s).times(100);
          }
        }
        if (this.validatorsState.previous) {
          this.previousElectionsStats = pastElections.find(e => e.electionId === this.validatorsState.previous.utimeSince);
          const stake = this.stakeTransactions.find(e => e.electionTime === this.validatorsState.previous.utimeSince);
          if (stake) {
            this.previousValidator = this.validatorsState.previous.list.find(e => e.publicKey === stake.publicKey);
          }
          if (this.previousValidator && this.previousElectionsStats) {
            const b = this.computeBonuses(
              this.previousValidator,
              this.validatorsState.previous,
              this.previousElectionsStats);
            const s = this.computeStake(
              this.previousValidator,
              this.validatorsState.previous,
              this.previousElectionsStats);
            this.previousProfitPercent = b.div(s).times(100);
          }
        }
        if (this.validatorsState.next) {
          this.nextElectionsStats = pastElections.find(e => e.electionId === this.validatorsState.next.utimeSince);
          const stake = this.stakeTransactions.find(e => e.electionTime === this.validatorsState.next.utimeSince);
          if (stake) {
            this.nextValidator = this.validatorsState.next.list.find(e => e.publicKey === stake.publicKey);
          }
        }
        this.calculateProfitability();
        this.currentLang = this.translateService.currentLang;
        if (this.langSubscription) {
          this.langSubscription.unsubscribe();
        }
        this.setTitle();
        this.langSubscription = this.translateService.onLangChange.subscribe(_ => {
          this.currentLang = this.translateService.currentLang;
          this.setTitle();
        });
        this.isReady = true;
      }).catch(e => {
        console.log(e);
        this.isReady = true;
        this.error = 404;
      });
    });
  }

  setTitle() {
    this.translateService.get('validator-page.title', this.account).toPromise().then(l => {
      this.titleService.setTitle(l);
    });
  }


  computeWeight(item: Validator, validatorSet: ValidatorSet): BigNumber {
    return new BigNumber(item.weight).div(validatorSet.totalWeight);
  }

  computeStake(item: Validator, validatorSet: ValidatorSet, electionsStats: PastElectionListItem): BigNumber {
    return this.computeWeight(item, validatorSet).mul(electionsStats.totalStake).round(0, BigNumber.ROUND_HALF_EVEN);
  }

  computeBonuses(item: Validator, validatorSet: ValidatorSet, electionsStats: PastElectionListItem): BigNumber {
    return this.computeWeight(item, validatorSet).mul(electionsStats.totalBonuses).round(0, BigNumber.ROUND_HALF_EVEN);
  }

  calculateProfitability() {
    const validatorsElectedFor = 65536;
    const stakeFrozenFor = validatorsElectedFor + 32768;

    const frozenStakes: StakeTransactionListItem[] = [];
    const intermediateRecovered: { [key: string]: BigNumber } = {};
    let currentTotalProfit = new BigNumber(0);
    let calculationError = new BigNumber(0);

    const recoverTransactions: StakeTransactionListItem[] = [];

    const recoveredStakes: { [key: string]: StakeTransactionListItem[] } = {};
    const electionTimes: { [key: string]: number[] } = {};
    const unaccountedAmmounts: { [key: string]: BigNumber } = {};
    const calculationErrors: { [key: string]: BigNumber } = {};
    const unfrozenStakeAmounts: { [key: string]: BigNumber } = {};
    const recoverValues: { [key: string]: BigNumber } = {};
    const recoverProfits: { [key: string]: BigNumber } = {};
    const recoverProfitsPercents: { [key: string]: BigNumber } = {};
    const calculationErrorItems: { [key: string]: StakeTransactionListItem[] } = {};

    let currentCalculationErrorItems: StakeTransactionListItem[] = [];

    this.stakeTransactions.forEach(st => {
      if (st.transactionType === 'Recover') {
        const unfrozenStakes: StakeTransactionListItem[] = [];
        let unfrozenStakeAmount = new BigNumber(0);
        while (frozenStakes.length !== 0) {
          const frozenStake = frozenStakes[0];
          if (frozenStake.electionTime + stakeFrozenFor >= st.time) {
            break;
          }

          unfrozenStakeAmount = unfrozenStakeAmount.add(frozenStake.value);
          unfrozenStakes.push(frozenStakes.shift());
        }

        let transactionValue = new BigNumber(st.value);

        frozenStakes.forEach(frozenStake => {
          const stakesInfo = this.totalStakes[frozenStake.electionTime];
          if (intermediateRecovered[frozenStake.electionTime.toString()] == null && stakesInfo != null) {
            const unaccountedStake = stakesInfo.stakes.reduce((t, stake) => t.add(stake.unaccountedStake), new BigNumber(0));

            transactionValue = transactionValue.sub(unaccountedStake);
            intermediateRecovered[frozenStake.electionTime.toString()] = unaccountedStake;
          }
        });

        if (unfrozenStakes.length === 0) {
          calculationError = calculationError.add(transactionValue);
          currentCalculationErrorItems.push(st);
        } else {
          const unaccountedStakes = unfrozenStakes
            .reduce((t, item) => {
              const value = intermediateRecovered[item.electionTime.toString()];
              if (value != null) {
                t = t.add(value);
                delete intermediateRecovered[item.electionTime.toString()];
              }
              return t;
            }, new BigNumber(0));
          unaccountedAmmounts[st.transactionHash] = unaccountedStakes;

          if (currentCalculationErrorItems.length > 0) {
            calculationErrors[st.transactionHash] = calculationError;
            calculationErrorItems[st.transactionHash] = currentCalculationErrorItems;
          }
          const profit = transactionValue.add(calculationError).add(unaccountedStakes).sub(unfrozenStakeAmount);
          recoverValues[st.transactionHash] = transactionValue.add(calculationError);
          const profitPercent = profit.div(unfrozenStakeAmount).times(100);

          currentTotalProfit = currentTotalProfit.add(profit);
          calculationError = new BigNumber(0);
          currentCalculationErrorItems = [];

          recoverTransactions.push(st);
          recoverProfits[st.transactionHash] = profit;
          recoverProfitsPercents[st.transactionHash] = profitPercent;
          recoveredStakes[st.transactionHash] = unfrozenStakes;
          electionTimes[st.transactionHash] = [];
          unfrozenStakes.forEach(s => {
            if (electionTimes[st.transactionHash].indexOf(s.electionTime) === -1) {
              electionTimes[st.transactionHash].push(s.electionTime);
            }
          });
          unfrozenStakeAmounts[st.transactionHash] = unfrozenStakeAmount;
        }
      } else if (st.transactionType === 'Send') {
        frozenStakes.push(st);
      }
    });


    this.recoveredStakes = recoveredStakes;
    this.electionTimes = electionTimes;
    this.unaccountedAmmounts = unaccountedAmmounts;
    this.calculationErrors = calculationErrors;
    this.unfrozenStakeAmounts = unfrozenStakeAmounts;
    this.recoverValues = recoverValues;
    this.recoverProfits = recoverProfits;
    this.calculationErrorItems = calculationErrorItems;
    this.recoverProfitsPercents = recoverProfitsPercents;

    this.recoverTransactions = recoverTransactions;
    this.fixCalculationErrors();

    this.recoverTransactions = this.recoverTransactions.reverse();

    if (this.recoverTransactions && this.recoverTransactions.length > 0) {
      this.calculationParams.calculateFrom = new Date(new BigNumber(this.stakeTransactions[0].time).minus(60).times(1000).toNumber());
      this.calculationParams.calculateTo = new Date(new BigNumber(this.recoverTransactions[0].time).plus(60).times(1000).toNumber());
      this.calculationParams.delegatedAmount = 1000;
      this.calculateProfit();
    }
  }

  fixCalculationErrors() {

    const recoverTransactions: StakeTransactionListItem[] = [];

    const recoveredStakes: { [key: string]: StakeTransactionListItem[] } = {};
    const mergedRecovers: { [key: string]: StakeTransactionListItem[] } = {};
    const electionTimes: { [key: string]: number[] } = {};
    const unaccountedAmmounts: { [key: string]: BigNumber } = {};
    const unfrozenStakeAmounts: { [key: string]: BigNumber } = {};
    const recoverValues: { [key: string]: BigNumber } = {};
    const recoverProfits: { [key: string]: BigNumber } = {};
    const recoverProfitsPercents: { [key: string]: BigNumber } = {};
    const calculationErrorItems: { [key: string]: StakeTransactionListItem[] } = {};

    let unmerged: StakeTransactionListItem[] = [];

    this.recoverTransactions.forEach(rt => {
      const recoverProfitsSum = unmerged.reduce((t, u) => t.plus(this.recoverProfits[u.transactionHash]), new BigNumber(0))
        .plus(this.recoverProfits[rt.transactionHash]);
      const unfrozenStakeAmountsSum = unmerged.reduce((t, u) => t.plus(this.unfrozenStakeAmounts[u.transactionHash]), new BigNumber(0))
        .plus(this.unfrozenStakeAmounts[rt.transactionHash]);
      const profitPercentSum = recoverProfitsSum.div(unfrozenStakeAmountsSum).times(100);
      if (profitPercentSum.lte(0) ||
        (profitPercentSum.gte(25)) ||
        (profitPercentSum.gte(7) && rt.time > 1592168400) ||
        (profitPercentSum.gte(5) && rt.time > 1598907600)) {
        unmerged.push(rt);
      } else if (unmerged.length === 0) {
        recoverTransactions.push(rt);

        recoveredStakes[rt.transactionHash] = this.recoveredStakes[rt.transactionHash];
        electionTimes[rt.transactionHash] = this.electionTimes[rt.transactionHash];
        unaccountedAmmounts[rt.transactionHash] = this.unaccountedAmmounts[rt.transactionHash];
        unfrozenStakeAmounts[rt.transactionHash] = this.unfrozenStakeAmounts[rt.transactionHash];
        recoverValues[rt.transactionHash] = this.recoverValues[rt.transactionHash];
        recoverProfits[rt.transactionHash] = this.recoverProfits[rt.transactionHash];
        recoverProfitsPercents[rt.transactionHash] = this.recoverProfitsPercents[rt.transactionHash];
        calculationErrorItems[rt.transactionHash] = [];
        const totalProfit = this.totalProfits.length > 0 ?
          this.totalProfits[this.totalProfits.length - 1].value.plus(recoverProfits[rt.transactionHash]) :
          recoverProfits[rt.transactionHash];
        this.totalProfits.push({timestamp: rt.time, value: totalProfit});
      } else {
        recoverTransactions.push(rt);
        recoveredStakes[rt.transactionHash] = this.recoveredStakes[rt.transactionHash];
        electionTimes[rt.transactionHash] = this.electionTimes[rt.transactionHash];
        unaccountedAmmounts[rt.transactionHash] = this.unaccountedAmmounts[rt.transactionHash];
        unfrozenStakeAmounts[rt.transactionHash] = this.unfrozenStakeAmounts[rt.transactionHash];
        recoverValues[rt.transactionHash] = this.recoverValues[rt.transactionHash];
        recoverProfits[rt.transactionHash] = this.recoverProfits[rt.transactionHash];
        calculationErrorItems[rt.transactionHash] = this.calculationErrorItems[rt.transactionHash] || [];
        unmerged.forEach(u => {
          this.electionTimes[u.transactionHash].forEach(et => electionTimes[rt.transactionHash].push(et));
          this.recoveredStakes[u.transactionHash].forEach(rs => recoveredStakes[rt.transactionHash].push(rs));
          // if (this.calculationErrorItems[u.transactionHash]) {
          //   this.calculationErrorItems[u.transactionHash].forEach(cei => {
          //     calculationErrorItems[rt.transactionHash].push(cei);
          //   });
          // }
          unaccountedAmmounts[rt.transactionHash] = unaccountedAmmounts[rt.transactionHash]
            .plus(this.unaccountedAmmounts[u.transactionHash]);
          unfrozenStakeAmounts[rt.transactionHash] = unfrozenStakeAmounts[rt.transactionHash]
            .plus(this.unfrozenStakeAmounts[u.transactionHash]);
          recoverValues[rt.transactionHash] = recoverValues[rt.transactionHash].plus(this.recoverValues[u.transactionHash]);
          recoverProfits[rt.transactionHash] = recoverProfits[rt.transactionHash].plus(this.recoverProfits[u.transactionHash]);
        });
        recoverProfitsPercents[rt.transactionHash] = recoverProfits[rt.transactionHash]
          .div(unfrozenStakeAmounts[rt.transactionHash]).times(100);
        mergedRecovers[rt.transactionHash] = unmerged;
        unmerged = [];
        electionTimes[rt.transactionHash] = electionTimes[rt.transactionHash].sort((a, b) => b - a);
        const totalProfit = this.totalProfits.length > 0 ?
          this.totalProfits[this.totalProfits.length - 1].value.plus(recoverProfits[rt.transactionHash]) :
          recoverProfits[rt.transactionHash];
        this.totalProfits.push({timestamp: rt.time, value: totalProfit});
      }
    });

    this.recoveredStakes = recoveredStakes;
    this.mergedRecovers = mergedRecovers;
    this.electionTimes = electionTimes;
    this.unaccountedAmmounts = unaccountedAmmounts;
    this.unfrozenStakeAmounts = unfrozenStakeAmounts;
    this.recoverValues = recoverValues;
    this.recoverProfits = recoverProfits;
    this.recoverProfitsPercents = recoverProfitsPercents;
    this.recoverTransactions = recoverTransactions;
    this.calculationErrorItems = calculationErrorItems;
  }

  scrollTo(elem: any) {
    if (elem) {
      if (elem.nativeElement) {
        elem.nativeElement.scrollIntoView({behavior: 'auto'});
      } else if (elem.scrollIntoView) {
        elem.scrollIntoView({behavior: 'auto'});
      }
    }
  }

  changeProfitabilityPageSize() {
    this.profitabilityPage = 1;
  }

  prevProfitabilityPage() {
    if (this.profitabilityPage > 1) {
      this.profitabilityPage--;
    }
  }

  hasNextProfitabilityPage() {
    return (this.profitabilityPage * this.profitabilityPageSize) < this.recoverTransactions.length;
  }

  nextProfitabilityPage() {
    if (this.hasNextProfitabilityPage()) {
      this.profitabilityPage++;
    }
  }

  calculateProfit() {
    const t = this;
    this.showAllCalculations = false;
    this.calculatorFormErrors = {};
    this.validatePositiveNumber('delegatedAmount');
    this.validateDate('calculateFrom');
    this.validateDate('calculateTo');

    delete this.calculationResults;

    if (Object.keys(this.calculatorFormErrors).length === 0) {
      let results: CalculationResultItem[] = [];
      const calculationLatestRecovers = {};
      this.calculationStartValue = new BigNumber(this.calculationParams.delegatedAmount).round(9).times(1000000000);
      const from = new BigNumber(this.calculationParams.calculateFrom.getTime()).div(1000).toNumber();
      const to = new BigNumber(this.calculationParams.calculateTo.getTime()).div(1000).toNumber();
      const stakeItems: StakeTransactionListItem[] = JSON.parse(JSON.stringify(this.stakeTransactions)).filter(e => {
        return e.transactionType === 'Send' && from <= e.time && to >= e.time;
      });
      this.calculationFirstStake = stakeItems[0];
      let firstFound = false;
      const recoverItems: StakeTransactionListItem[] = JSON.parse(JSON.stringify(this.recoverTransactions)).reverse().filter(e => {
        firstFound = firstFound || this.electionTimes[e.transactionHash].indexOf(this.calculationFirstStake.electionTime) !== -1;
        return (firstFound && new BigNumber(this.calculationParams.calculateTo.getTime()).div(1000).gte(e.time));
      });

      let currentValue = this.calculationStartValue.div(2);
      let nextRecover: StakeTransactionListItem = recoverItems[0];
      let nextStake: StakeTransactionListItem = this.calculationFirstStake;
      let alreadyUsedElections: number[] = [];

      alreadyUsedElections.push(this.calculationFirstStake.electionTime);

      function runPart(part: number) {
        while (nextRecover) {
          const profit = currentValue.times(t.recoverProfitsPercents[nextRecover.transactionHash].div(100))
            .div(1000000000).round(9, BigNumber.ROUND_FLOOR).times(1000000000);
          const startValue = currentValue.round(9);
          currentValue  = currentValue.plus(profit);
          results.push({
            part,
            time: nextRecover.time,
            electionTime: nextStake.electionTime,
            startValue,
            transactionHash: nextRecover.transactionHash,
            endValue: currentValue,
            profit
          });
          calculationLatestRecovers[part] = nextRecover.transactionHash;

          const nextStakeIndex = stakeItems.findIndex(e => e.time > nextRecover.time &&
            alreadyUsedElections.indexOf(e.electionTime) === -1);
          if (nextStakeIndex !== -1) {
            nextStake = stakeItems[nextStakeIndex];
            alreadyUsedElections.push(nextStake.electionTime);
            // stakeItems = stakeItems.slice(nextStakeIndex);
            const nextRecoverIndex = recoverItems.findIndex(e => {
              return t.electionTimes[e.transactionHash].indexOf(nextStake.electionTime) !== -1;
            });
            nextRecover = recoverItems[nextRecoverIndex];
            // recoverItems = recoverItems.splice(nextRecoverIndex);
          } else {
            nextRecover = null;
          }
        }
      }

      runPart(1);
      let part1Profit = results[results.length - 1].endValue;
      this.calculationSecondStake = stakeItems.find(e => alreadyUsedElections.indexOf(e.electionTime) === -1);
      let part2Profit = new BigNumber(0);
      if (this.calculationSecondStake) {
        currentValue = this.calculationStartValue.div(2);
        nextRecover = recoverItems.find(e =>
          this.electionTimes[e.transactionHash].indexOf(this.calculationSecondStake.electionTime) !== -1);
        nextStake = this.calculationSecondStake;
        runPart(2);
        part2Profit = results[results.length - 1].endValue;
      } else {
        results = [];
        currentValue = this.calculationStartValue;
        nextRecover = recoverItems[0];
        nextStake = this.calculationFirstStake;
        alreadyUsedElections = [];
        alreadyUsedElections.push(this.calculationFirstStake.electionTime);
        runPart(1);
        part1Profit = results[results.length - 1].endValue;
      }

      this.calculationLatestRecovers = [];
      if (calculationLatestRecovers[1]) {
        this.calculationLatestRecovers.push(calculationLatestRecovers[1]);
      }
      if (calculationLatestRecovers[2]) {
        this.calculationLatestRecovers.push(calculationLatestRecovers[2]);
      }
      this.calculationTotalProfit = part1Profit.plus(part2Profit).minus(this.calculationStartValue);
      this.calculationTotalProfitPercent = this.calculationTotalProfit.div(this.calculationStartValue).times(100);
      this.calculationResults = results.sort((a, b) => b.electionTime - a.electionTime);
    }
  }

  updateValue(field: string) {
    delete this.calculatorFormErrors[field];
  }

  validateDate(field: string) {
    if (( Object.prototype.toString.call(this.calculationParams[field]) === '[object Date]' &&
      !isNaN(this.calculationParams[field].getTime()) )) {
      delete this.calculatorFormErrors[field];
    } else {
      delete this.calculationParams[field];
      this.calculatorFormErrors[field] = ['validation.wrong-date'];
    }
  }

  validatePositiveNumber(field: string) {
    if (this.calculationParams[field]) {
      if (typeof this.calculationParams[field] === 'string' && this.calculationParams[field].trim() === '') {
        delete this.calculationParams[field];
        this.calculatorFormErrors[field] = ['validation.required'];
      } else if (isNaN(+this.calculationParams[field])) {
        delete this.calculationParams[field];
        this.calculatorFormErrors[field] = ['validation.isNaN'];
      } else if (this.calculationParams[field] <= 0) {
        delete this.calculationParams[field];
        this.calculatorFormErrors[field] = ['validation.mustBrPositive'];
      } else {
        this.calculationParams[field] = +this.calculationParams[field];
      }
    } else {
      this.calculatorFormErrors[field] = ['validation.required'];
    }
  }

  exportProfitability() {
    let result = '';
    const headersKeys = [
      'validator-page.columns.elections',
      'validator-page.columns.stake-sent',
      'validator-page.columns.stake-accounted',
      'validator-page.columns.recover-amount',
      'validator-page.columns.profit',
      'validator-page.columns.profit-percent',
      'messages.date-n-time'
    ];
    this.translateService.get(headersKeys).toPromise().then(headers => {
      result += headersKeys.map(k => headers[k]).join(';') + '\n';
      this.recoverTransactions.forEach(rt => {
        result += '\"' + this.electionTimes[rt.transactionHash].join(',') + '\";';
        result += '\"' + this.unfrozenStakeAmounts[rt.transactionHash].div(1000000000).toString() + '\";';
        result += '\"' + this.unfrozenStakeAmounts[rt.transactionHash]
          .minus(this.unaccountedAmmounts[rt.transactionHash]).div(1000000000).toString() + '\";';
        result += '\"' + this.recoverValues[rt.transactionHash].div(1000000000).toString() + '\";';
        result += '\"' + this.recoverProfits[rt.transactionHash].div(1000000000).toString() + '\";';
        result += '\"' + this.recoverProfitsPercents[rt.transactionHash].round(9).toString() + '\";';
        result += '\"' + rt.time + '\";\n';
      });

      download(result, 'validator_' + this.account.addressHex.toLowerCase() + '.csv', 'text/csv');
    });
  }

  exportCalculatorResults() {
    let result = '';
    const headersKeys = [
      'validator-page.columns.elections',
      'validator-page.columns.stake-accounted',
      'validator-page.columns.profit',
      'validator-page.columns.recover-amount',
      'validator-page.columns.profit-percent',
      'messages.date-n-time'
    ];
    this.translateService.get(headersKeys).toPromise().then(headers => {
      result += headersKeys.map(k => '\"' + headers[k] + '\"').join(';') + '\n';
      this.calculationResults.forEach(res => {
        result += '\"' + res.electionTime + '\";';
        result += '\"' + res.startValue.div(1000000000).toString() + '\";';
        result += '\"' + res.profit.div(1000000000).toString() + '\";';
        result += '\"' + res.endValue.div(1000000000).toString() + '\";';
        result += '\"' + this.recoverProfitsPercents[res.transactionHash].round(9).toString() + '\";';
        result += '\"' + res.time + '\";\n';
      });

      download(result, 'calculation_' + this.account.addressHex.toLowerCase() + '.csv', 'text/csv');
    });
  }
  ngOnDestroy(): void {
    if (this.routeParamsSubscription) {
      this.routeParamsSubscription.unsubscribe();
    }
    if (this.langSubscription) {
      this.langSubscription.unsubscribe();
    }
  }

}

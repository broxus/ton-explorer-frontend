import {Component, OnDestroy, OnInit} from '@angular/core';

import {ApiService} from '../api/services/api.service';
import {ValidatorsState} from '../api/models/validators-state';
import {ValidatorSet} from '../api/models/validator-set';
import {PastElectionListItem} from '../api/models/past-election-list-item';
import BigNumber from 'bignumber.js';
import {StakeTransactionListItem} from '../api/models/stake-transaction-list-item';
import {
  ElectionsStatus,
  ElectionsStatuses,
  Participants,
  SelectedSet,
  SelectedSetStats,
  UtimeToSelectedSet
} from '../elections-models';
import {Subscription} from 'rxjs';
import {Title} from '@angular/platform-browser';
import {TranslateService} from '@ngx-translate/core';


@Component({
  selector: 'app-validators-list',
  templateUrl: './validators-list.component.html',
  styleUrls: ['./validators-list.component.scss']
})
export class ValidatorsListComponent implements OnInit, OnDestroy {

  private langSubscription: Subscription;

  currentLang: string;

  state: ValidatorsState;

  utimeToSelectedSet: UtimeToSelectedSet;
  selectedSetStats: SelectedSetStats;
  electionsStatus: ElectionsStatus;
  participants: Participants = {} as Participants;

  validatorSet: ValidatorSet = null;
  electionsStats: PastElectionListItem = null;
  electionsStatuses: ElectionsStatuses = null;
  selectedElectionId: number = null;

  selectedSet: SelectedSet = 'current';

  private checkElectionsStateInterval: any;
  private checkElectionsStatusInterval: any;

  constructor(private apiService: ApiService,
              private titleService: Title,
              private translateService: TranslateService) {}

  ngOnInit(): void {
    this.currentLang = this.translateService.currentLang;
    if (this.langSubscription) {
      this.langSubscription.unsubscribe();
    }
    this.setTitle();
    this.langSubscription = this.translateService.onLangChange.subscribe(_ => {
      this.currentLang = this.translateService.currentLang;
      this.setTitle();
    });
    this.loadValidatorsState().catch(() => {
    });
  }

  setTitle() {
    this.translateService.get('validators-list.title').toPromise().then(l => {
      this.titleService.setTitle(l);
    });
  }

  async loadValidatorsState() {
    this.state = await this.apiService.getApiValidatorsState().toPromise();
    [this.utimeToSelectedSet, this.participants] = (['previous', 'current', 'next'] as SelectedSet[])
      .reduce(([sets, participants], item) => {
        const stateItem = this.state?.[item];
        if (stateItem == null) {
          return [sets, participants];
        }
        sets[stateItem.utimeSince] = item;

        const stakes: StakeTransactionListItem[] | null = this.state?.[`${item}Stakes`];
        if (stakes != null) {
          participants[item] = stakes.reduce((addresses, stake) => {
            if (stake.publicKey != null) {
              addresses.set(stake.publicKey, stake);
            }
            return addresses;
          }, new Map());
        }

        return [sets, participants];
      }, [{} as UtimeToSelectedSet, {} as Participants]);

    this.updateElectionsStatus();

    this.selectValidators(this.selectedSet);

    await this.loadElectionsState();
    this.startCheckElectionsState();
    this.startCheckElectionsStatus();
  }

  async loadElectionsState() {
    const pastElections = await this.apiService.getApiValidatorsPastElections().toPromise();

    this.selectedSetStats = pastElections
      .sort((a, b) => b.electionId - a.electionId)
      .reduce((selectedSetStats, item) =>
        this.utimeToSelectedSet[item.electionId] ? {
          ...selectedSetStats,
          [this.utimeToSelectedSet[item.electionId]]: item
        } : selectedSetStats, {} as SelectedSetStats);
    this.selectValidators(this.selectedSet);
  }

  async loadParticipants(electionId: number) {
    return await this.apiService.postApiStakeTransactionElectionStakes({
      body: {electionId}
    }).toPromise();
  }

  selectValidators(set: SelectedSet) {
    this.selectedSet = set;
    this.validatorSet = this.state?.[set];
    this.electionsStats = this.selectedSetStats?.[set];
    this.electionsStatus = this.electionsStatuses?.[set];
    this.selectedElectionId = this.validatorSet?.utimeSince || this.state?.current?.utimeUntil;
  }

  checkElectionsState() {
    this.loadElectionsState().catch(() => {
    });
  }

  startCheckElectionsState() {
    this.stopCheckElectionsState();
    this.checkElectionsStateInterval = setInterval(() => this.checkElectionsState(), 10000);
  }

  stopCheckElectionsState() {
    clearInterval(this.checkElectionsStateInterval);
  }

  updateElectionsStatus() {
    const now = new Date();
    const utimeUtc = new BigNumber(now.getTime())
      .sub(new BigNumber(now.getTimezoneOffset()).mul(60000))
      .div(1000)
      .ceil()
      .toNumber();

    this.electionsStatuses = (['previous', 'current', 'next'] as SelectedSet[]).reduce((electionsStatuses, set) => {
      if (!this.state?.[set]) {
        electionsStatuses[set] = 'waiting';
        return electionsStatuses;
      }

      const electionsStart = this.state[set].utimeUntil - this.state.timings.electionsStartBefore;
      const electionsEnd = this.state[set].utimeUntil - this.state.timings.electionsEndBefore;

      if (utimeUtc < electionsStart) {
        return {...electionsStatuses, [set]: 'waiting'};
      } else if (utimeUtc <= electionsEnd) {
        return {...electionsStatuses, [set]: 'open'};
      } else {
        return {...electionsStatuses, [set]: 'closed'};
      }
    }, {} as ElectionsStatuses);
    this.electionsStatus = this.electionsStatuses[this.selectedSet];
  }

  startCheckElectionsStatus() {
    this.stopCheckElectionsStatus();
    this.checkElectionsStatusInterval = setInterval(() => this.updateElectionsStatus(), 5000);
  }

  stopCheckElectionsStatus() {
    clearInterval(this.checkElectionsStatusInterval);
  }

  ngOnDestroy(): void {
    this.stopCheckElectionsState();
    this.stopCheckElectionsStatus();
    if (this.langSubscription) {
      this.langSubscription.unsubscribe();
    }
  }

}

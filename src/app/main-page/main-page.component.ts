import {Component, OnDestroy, OnInit} from '@angular/core';
import {ApiService} from '../api/services/api.service';
import {BlockchainStats} from '../api/models/blockchain-stats';
import {BlockListItem} from '../api/models/block-list-item';
import {AccountListItem} from '../api/models/account-list-item';
import {MessageListItem} from '../api/models/message-list-item';
import {TransactionListItem} from '../api/models/transaction-list-item';

import BigNumber from 'bignumber.js';

import namedAddresses from '../named-addresses';
import {TransactionsRequest} from '../api/models/transactions-request';
import {MessagesRequest} from '../api/models/messages-request';
import {Title} from '@angular/platform-browser';
import {TranslateService} from '@ngx-translate/core';
import {Subscription} from 'rxjs';
import {StakeTransactionListRequest} from '../api/models/stake-transaction-list-request';
import {StakeTransactionListItem} from '../api/models/stake-transaction-list-item';
import {ValidatorsState} from '../api/models/validators-state';
import {PastElectionListItem} from '../api/models/past-election-list-item';
import {Validator} from '../api/models/validator';
import {AccountId} from '../api/models/account-id';
import {MapAccountId} from '../api/models/map-account-id';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent implements OnInit, OnDestroy {

  private langSubscription: Subscription;

  currentLang: string;

  namedAddresses = namedAddresses;
  ELECTOR = {workchain: -1, address: '3333333333333333333333333333333333333333333333333333333333333333'};

  stats: BlockchainStats;
  volume24: number;
  totalSupply: number;
  tps: number;
  mps: number;

  loading = false;
  loadedAt: number;

  showEmptyBlocks = false;
  showTickTok = false;
  showElectorMessages = false;
  showElectorTransactions = false;

  blocks: BlockListItem[];
  transactions: TransactionListItem[];
  stakeTransactions: StakeTransactionListItem[];
  messages: MessageListItem[];
  createdAccounts: AccountListItem[];
  updatedAccounts: AccountListItem[];

  currentElections: PastElectionListItem;
  validatorsState: ValidatorsState;
  validatorsAddresses: MapAccountId;

  constructor(private apiService: ApiService,
              private titleService: Title,
              private translateService: TranslateService) {
  }

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
    this.load();
  }

  setTitle() {
    this.translateService.get('header.logo').toPromise().then(l => {
      this.titleService.setTitle(l);
    });
  }
  load() {
    if (!this.loading) {
      this.loading = true;
      const loadedAt = new BigNumber(new Date().getTime()).div(1000).round().toNumber();
      Promise.all([
        this.loadStats(),
        this.loadBlocks(),
        this.loadTransactions(),
        this.loadMessages(),
        this.loadCreatedAccounts(),
        this.loadUpdatedAccounts(),
        this.loadStakeTransactions(),
        this.loadValidators()
      ]).then(_ => {
        this.loading = false;
        this.loadedAt = loadedAt;
      });
    }
  }

  loadStats() {
    this.apiService.getApiStats().toPromise().then(stats => {
      this.stats = stats;
      this.volume24 = new BigNumber(this.stats.volume24).div(1000000000).round().toNumber();
      this.totalSupply = new BigNumber(this.stats.totalSupply).div(1000000000).round().toNumber();
      this.tps = new BigNumber(this.stats.counts.H1.transactions).div(60).div(60).round(2).toNumber();
      this.mps = new BigNumber(this.stats.counts.H1.messages).div(60).div(60).round(2).toNumber();
    });
  }

  loadBlocks() {
    this.apiService.postApiBlockList({
      body: {
        limit: 10,
        offset: 0,
        skipEmpty: !this.showEmptyBlocks
      }
    }).toPromise().then(blocks => {
      this.blocks = blocks;
    });
  }

  loadTransactions() {
    const body: TransactionsRequest = {
      limit: 10,
      offset: 0
    };
    if (!this.showTickTok) {
      body.transactionTypes = ['ordinary'];
    }
    if (!this.showElectorTransactions) {
      body.excludeAccounts = [this.ELECTOR];
    }
    this.apiService.postApiTransactionList({body}).toPromise().then(transactions => {
      this.transactions = transactions;
    });
  }

  loadStakeTransactions() {
    const body: StakeTransactionListRequest = {
      limit: 10,
      offset: 0
    };
    this.apiService.postApiStakeTransactionList({body}).toPromise().then(stakeTransactions => {
      this.stakeTransactions = stakeTransactions;
    });
  }

  loadMessages() {
    const body: MessagesRequest = {
      limit: 10,
      offset: 0
    };

    if (!this.showElectorMessages) {
      body.excludeAccounts = [this.ELECTOR];
    }

    this.apiService.postApiMessageList({body}).toPromise().then(messages => {
      this.messages = messages;
    });
  }

  loadCreatedAccounts() {
    this.apiService.postApiAccountList({
      body: {
        limit: 10,
        offset: 0,
        orderColumn: 'created',
        asc: false
      }
    }).toPromise().then(accounts => {
      this.createdAccounts = accounts;
    });
  }

  loadUpdatedAccounts() {
    this.apiService.postApiAccountList({
      body: {
        limit: 10,
        offset: 0,
        orderColumn: 'updated',
        asc: false
      }
    }).toPromise().then(accounts => {
      this.updatedAccounts = accounts;
    });
  }

  loadValidators() {
    Promise.all([
      this.apiService.getApiValidatorsPastElections().toPromise(),
      this.apiService.getApiValidatorsState().toPromise()
    ]).then(results => {
      this.validatorsState = results[1];
      this.validatorsState.current.list = this.validatorsState.current.list
        .sort((a, b) => new BigNumber(b.weight).minus(a.weight).toNumber());
      this.currentElections = results[0].find(e => e.electionId === this.validatorsState.current.utimeSince);
      this.apiService.postApiValidatorGetAccounts({body: {
          publicKeys: this.validatorsState.current.list.map(e => e.publicKey)
        }}).toPromise().then(result => {
          this.validatorsAddresses = result.publicKeyToAccountId;
      });
    });
  }
  computeWeight(item: Validator): BigNumber {
    return new BigNumber(item.weight).div(this.validatorsState.current.totalWeight);
  }

  computeBonuses(item: Validator): BigNumber {
    return this.computeWeight(item).mul(this.currentElections.totalBonuses).ceil();
  }


  ngOnDestroy() {
    if (this.langSubscription) {
      this.langSubscription.unsubscribe();
    }
  }

}

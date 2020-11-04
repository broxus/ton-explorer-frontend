import {Component, OnDestroy, OnInit} from '@angular/core';
import BigNumber from 'bignumber.js';

import {ApiService} from '../api/services/api.service';
import {BlockchainStats} from '../api/models/blockchain-stats';
import {Subscription} from 'rxjs';
import {Title} from '@angular/platform-browser';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-transactions-list',
  templateUrl: './transactions-list.component.html',
  styleUrls: ['./transactions-list.component.scss']
})
export class TransactionsListComponent implements OnInit, OnDestroy {

  private langSubscription: Subscription;

  currentLang: string;

  stats: BlockchainStats;
  volume24: number;
  tps: number;

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
    this.loadStats();
  }

  setTitle() {
    this.translateService.get('transactions-list.title').toPromise().then(l => {
      this.titleService.setTitle(l);
    });
  }

  loadStats() {
    this.apiService.getApiStats().toPromise().then(stats => {
      this.stats = stats;
      this.volume24 = new BigNumber(this.stats.volume24).div(1000000000).round().toNumber();
      this.tps = new BigNumber(this.stats.counts.H1.transactions).div(60).div(60).round(2).toNumber();
    });
  }

  ngOnDestroy(): void {
    if (this.langSubscription) {
      this.langSubscription.unsubscribe();
    }
  }
}

import { Component, OnInit } from '@angular/core';
import {BlockchainStats} from '../api/models/blockchain-stats';
import {ApiService} from '../api/services/api.service';
import BigNumber from 'bignumber.js';
import {Subscription} from 'rxjs';
import {Title} from '@angular/platform-browser';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-messages-list',
  templateUrl: './messages-list.component.html',
  styleUrls: ['./messages-list.component.scss']
})
export class MessagesListComponent implements OnInit {

  private langSubscription: Subscription;

  currentLang: string;

  stats: BlockchainStats;
  volume24: number;
  mps: number;

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
    this.translateService.get('messages-list.title').toPromise().then(l => {
      this.titleService.setTitle(l);
    });
  }

  loadStats() {
    this.apiService.getApiStats().toPromise().then(stats => {
      this.stats = stats;
      this.volume24 = new BigNumber(this.stats.volume24).div(1000000000).round().toNumber();
      this.mps = new BigNumber(this.stats.counts.H1.messages).div(60).div(60).round(2).toNumber();
    });
  }

}

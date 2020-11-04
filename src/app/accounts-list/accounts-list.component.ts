import {Component, OnDestroy, OnInit} from '@angular/core';
import {BlockchainStats} from '../api/models/blockchain-stats';
import {ApiService} from '../api/services/api.service';
import namedAddresses from '../named-addresses';
import {AccountListItem} from '../api/models/account-list-item';
import {AccountsRequest} from '../api/models/accounts-request';
import {Title} from '@angular/platform-browser';
import {TranslateService} from '@ngx-translate/core';
import {Subscription} from 'rxjs';
import download from 'downloadjs';
import BigNumber from 'bignumber.js';

@Component({
  selector: 'app-accounts-list',
  templateUrl: './accounts-list.component.html',
  styleUrls: ['./accounts-list.component.scss']
})
export class AccountsListComponent implements OnInit, OnDestroy {

  private langSubscription: Subscription;
  currentLang: string;

  namedAddresses = namedAddresses;

  stats: BlockchainStats;

  loading = false;

  page = 1;
  pageSize = 20;

  request: AccountsRequest = {
    limit: this.pageSize,
    offset: this.pageSize * (this.page - 1),
    orderColumn: 'created',
    asc: false,
  };
  accounts: AccountListItem[];

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
    this.loadData();
  }

  setTitle() {
    this.translateService.get('accounts-list.title').toPromise().then(l => {
      this.titleService.setTitle(l);
    });
  }

  loadStats() {
    this.apiService.getApiStats().toPromise().then(stats => {
      this.stats = stats;
    });
  }

  loadData() {
    this.loading = true;
    this.request.limit = this.pageSize;
    this.request.offset = this.pageSize * (this.page - 1);

    this.apiService.postApiAccountList({body: this.request}).toPromise().then(accounts => {
      this.accounts = accounts;
      this.loading = false;
    });
  }

  changePageSize() {
    this.page = 1;
    this.loadData();
  }

  changeOrder(column: string, defaultAsc: boolean = false) {
    this.page = 1;
    if (this.request.orderColumn !== column) {
      this.request.orderColumn = column;
      this.request.asc = defaultAsc;
    } else {
      this.request.asc = !this.request.asc;
    }
    this.loadData();
  }

  hasNextPage() {
    return this.accounts.length <= this.pageSize;
  }

  nextPage() {
    if (this.hasNextPage()) {
      this.page++;
      this.loadData();
    }
  }

  prevPage() {
    if (this.page > 1) {
      this.page--;
      this.loadData();
    }
  }

  exportCsv() {
    let result = '';
    const headersKeys = [
      'accounts-list.column.address',
      'accounts-list.column.balance',
      'accounts-list.column.created',
      'accounts-list.column.updated',
    ];
    this.translateService.get(headersKeys).toPromise().then(headers => {
      result += headersKeys.map(k => '\"' + headers[k] + '\"').join(';') + '\n';
      this.accounts.forEach(a => {
        result += '\"' + a.workchain + ':' + a.address + '\";';
        result += '\"' + new BigNumber(a.balance).div(1000000000).toString() + '\";';
        result += '\"' + a.created + '\";';
        result += '\"' + a.updated + '\";\n';
      });
      download(result, 'accounts.csv', 'text/csv');
    });
  }

  ngOnDestroy(): void {
    if (this.langSubscription) {
      this.langSubscription.unsubscribe();
    }
  }
}

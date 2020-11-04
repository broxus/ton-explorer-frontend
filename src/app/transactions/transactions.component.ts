import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {AccountId} from '../api/models/account-id';
import {ApiService} from '../api/services/api.service';
import {ActivatedRoute, Router} from '@angular/router';
import {TransactionListItem} from '../api/models/transaction-list-item';
import namedAddresses from '../named-addresses';
import {TransactionsRequest} from '../api/models/transactions-request';
import BigNumber from 'bignumber.js';
import {TranslateService} from '@ngx-translate/core';
import download from 'downloadjs';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss']
})
export class TransactionsComponent implements OnInit, OnDestroy {

  ELECTOR = {workchain: -1, address: '3333333333333333333333333333333333333333333333333333333333333333'};

  namedAddresses = namedAddresses;

  @Input() account: AccountId;
  @Input() pageSize = 10;
  @Input() showHeader = false;

  loading = false;

  showElectorTransactions: boolean;
  showTickTock: boolean;

  newCount = 0;
  checkNewInterval: any;

  transactions: TransactionListItem[];
  count: number;
  lastPage = 0;
  page = 1;

  request: TransactionsRequest = { limit: this.pageSize, offset: this.pageSize * (this.page - 1)};

  constructor(private apiService: ApiService,
              private translateService: TranslateService,
              private route: ActivatedRoute,
              private router: Router) { }

  ngOnInit(): void {
    if (this.account) {
      this.request.account = this.account;
    }
    this.showTickTock = !!this.account;
    this.showElectorTransactions = !!this.account;
    this.loadData(true);
  }

  loadData(countReload: boolean = false) {
    this.loading = true;
    const time = new BigNumber(new Date().getTime()).div(1000).round().toNumber();
    if (countReload) {
      this.stopCheckNew();
      this.newCount = 0;
      delete this.request.toTs;
    }
    this.request.limit = this.pageSize;
    this.request.offset = this.pageSize * (this.page - 1);

    if (this.showElectorTransactions) {
      delete this.request.excludeAccounts;
    } else {
      this.request.excludeAccounts = [this.ELECTOR];
    }

    if (this.showTickTock) {
      delete this.request.transactionTypes;
    } else {
      this.request.transactionTypes = ['ordinary'];
    }

    this.apiService.postApiTransactionList({body: this.request}).toPromise().then(transactions => {
      if (countReload) {
        this.apiService.postApiTransactionCount({body: this.request}).toPromise().then(resp => {
          this.transactions = transactions;
          if (!this.request.toTs && this.transactions.length > 0) {
            this.request.toTs = time;
            this.startCheckNew();
          }
          this.count = resp.count;
          this.lastPage = Math.ceil(this.count / this.pageSize);
          this.loading = false;
        });
      } else {
        this.transactions = transactions;
        this.loading = false;
      }
    });
  }

  checkNew() {
    if (this.request) {
      const req = JSON.parse(JSON.stringify(this.request));
      req.fromTs = req.toTs;
      delete req.toTs;
      this.apiService.postApiTransactionCount({body: req}).toPromise().then(res => {
        this.newCount = res.count;
      });
    }
  }

  startCheckNew() {
    this.stopCheckNew();
    this.checkNewInterval = setInterval(() => this.checkNew(), 10000);
  }

  stopCheckNew() {
    clearInterval(this.checkNewInterval);
  }

  changePageSize() {
    this.page = 1;
    this.loadData(true);
  }

  hasNextPage() {
    return (this.page * this.pageSize) < this.count;
  }

  nextPage() {
    if (this.hasNextPage()) {
      this.page++;
      this.loadData(false);
    }
  }

  prevPage() {
    if (this.page > 1) {
      this.page--;
      this.loadData(false);
    }
  }

  exportCsv() {
    let result = '';
    const headersKeys = [
      'common.ID',
      'transactions.transaction-type',
      'transactions.balance-change',
      'common.Account.1',
      'transactions.date-n-time'
    ];
    this.translateService.get(headersKeys).toPromise().then(headers => {
      result += headersKeys.map(k => '\"' + headers[k] + '\"').join(';') + '\n';
      this.transactions.forEach(t => {
        result += t.hash.toLowerCase() + ';';
        result += t.transactionType + ';';
        result += new BigNumber(t.balanceChange).div(1000000000).toString() + ';';
        result += t.time + ';';
        result += t.workchain + ':' + t.accountId.toLowerCase() + ';\n';
      });

      download(result, 'transactions.csv', 'text/csv');
    });
  }

  ngOnDestroy(): void {
    this.stopCheckNew();
  }
}

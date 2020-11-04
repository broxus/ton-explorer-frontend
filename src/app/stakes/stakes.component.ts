import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {AccountId} from '../api/models/account-id';
import {ApiService} from '../api/services/api.service';
import BigNumber from 'bignumber.js';
import {StakeTransactionListItem} from '../api/models/stake-transaction-list-item';
import namedAddresses from '../named-addresses';
import {StakeTransactionListRequest} from '../api/models/stake-transaction-list-request';
import {TranslateService} from '@ngx-translate/core';
import download from 'downloadjs';

@Component({
  selector: 'app-stakes',
  templateUrl: './stakes.component.html',
  styleUrls: ['./stakes.component.scss']
})
export class StakesComponent implements OnInit, OnDestroy {

  namedAddresses = namedAddresses;

  @Input() account: AccountId;
  @Input() electionTime: number;
  @Input() pageSize = 10;
  @Input() showHeader = false;

  loading = false;

  newCount = 0;
  checkNewInterval: any;

  transactions: StakeTransactionListItem[];
  count: number;
  lastPage = 0;
  page = 1;

  request: StakeTransactionListRequest = { limit: this.pageSize, offset: this.pageSize * (this.page - 1)};

  constructor(private apiService: ApiService,
              private translateService: TranslateService) { }

  ngOnInit(): void {
    if (this.account) {
      this.request.account = this.account;
    }
    if (this.electionTime) {
      this.request.electionTime = this.electionTime;
    }
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

    this.apiService.postApiStakeTransactionList({body: this.request}).toPromise().then(transactions => {
      if (countReload) {
        this.apiService.postApiStakeTransactionCount({body: this.request}).toPromise().then(resp => {
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
      this.apiService.postApiStakeTransactionCount({body: req}).toPromise().then(res => {
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
        'validators.Elections',
        'common.Validator.1',
        'common.Type',
        'transactions.hash-id',
        'message-page.value',
        'messages.date-n-time',
        'validators.public-key',
        'validators.adnl-address'
      ];
      this.translateService.get(headersKeys).toPromise().then(headers => {
        result += headersKeys.map(k => '\"' + headers[k] + '\"').join(';') + '\n';
        this.transactions.forEach(t => {
          result += '\"' + (t.electionTime ? t.electionTime : '') + '\";';
          result += '\"' + t.accountWorkchain + ':' + t.accountAddress.toLowerCase() + '\";';
          result += '\"' + t.transactionType + '\";';
          result += '\"' + t.transactionHash.toLowerCase() + '\";';
          result += '\"' + new BigNumber(t.value).div(1000000000).toString() + '\";';
          result += '\"' + t.time + '\";';
          result += '\"' + (t.publicKey ? t.publicKey.toLowerCase() : '') + '\";';
          result += '\"' + (t.adnl ? t.adnl.toLowerCase() : '') + '\";\n';
        });

        download(result, 'stakes.csv', 'text/csv');
      });
  }

  ngOnDestroy(): void {
    this.stopCheckNew();
  }

}

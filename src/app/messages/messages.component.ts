import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {AccountId} from '../api/models/account-id';
import {ApiService} from '../api/services/api.service';
import {ActivatedRoute, Router} from '@angular/router';
import BigNumber from 'bignumber.js';
import {MessageListItem, MessagesRequest} from '../api/models';
import {TranslateService} from '@ngx-translate/core';
import download from 'downloadjs';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements OnInit, OnDestroy {

  ELECTOR = {workchain: -1, address: '3333333333333333333333333333333333333333333333333333333333333333'};

  @Input() account: AccountId;
  @Input() pageSize = 10;
  @Input() showHeader = false;

  loading = false;

  showElectorMessages: boolean;

  newCount = 0;
  checkNewInterval: any;

  messages: MessageListItem[];
  count: number;
  lastPage = 0;
  page = 1;

  request: MessagesRequest = { limit: this.pageSize, offset: this.pageSize * (this.page - 1)};

  constructor(private apiService: ApiService,
              private translateService: TranslateService,
              private route: ActivatedRoute,
              private router: Router) { }

  ngOnInit(): void {
    if (this.account) {
      this.request.account = this.account;
    }
    this.showElectorMessages = !!this.account;
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

    if (this.showElectorMessages) {
      delete this.request.excludeAccounts;
    } else {
      this.request.excludeAccounts = [this.ELECTOR];
    }

    this.apiService.postApiMessageList({body: this.request}).toPromise().then(messages => {
      if (countReload) {
        this.apiService.postApiMessageCount({body: this.request}).toPromise().then(resp => {
          this.messages = messages;
          if (!this.request.toTs && this.messages.length > 0) {
            this.request.toTs = time;
            this.startCheckNew();
          }
          this.count = resp.count;
          this.lastPage = Math.ceil(this.count / this.pageSize);
          this.loading = false;
        });
      } else {
        this.messages = messages;
        this.loading = false;
      }
    });
  }

  checkNew() {
    if (this.request) {
      const req = JSON.parse(JSON.stringify(this.request));
      req.fromTs = req.toTs;
      delete req.toTs;
      this.apiService.postApiMessageCount({body: req}).toPromise().then(res => {
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
      'messages.body-hash',
      'transaction-messages.sender',
      'transaction-messages.recipient',
      'messages.value',
      'message-page.message-type',
      'common.Transaction.1',
      'messages.date-n-time'
    ];
    this.translateService.get(headersKeys).toPromise().then(headers => {
      result += headersKeys.map(k => '\"' + headers[k] + '\"').join(';') + '\n';
      this.messages.forEach(m => {
        result += '\"' + m.bodyHash.toLowerCase() + '\";';
        result += '\"' + (m.srcAddress ? m.srcWorkchain + ':' + m.srcAddress : '')  + '\";';
        result += '\"' + (m.dstAddress ? m.dstWorkchain + ':' + m.dstAddress : '')  + '\";';
        result += '\"' + (m.value ? new BigNumber(m.value).div(1000000000).toString() : '') + '\";';
        result += '\"' + m.messageType + '\";';
        result += '\"' + m.transactionHash.toLowerCase() + '\";';
        result += '\"' + m.transactionTime + '\";\n';
      });

      download(result, 'messages.csv', 'text/csv');
    });
  }

  ngOnDestroy(): void {
    this.stopCheckNew();
  }

}

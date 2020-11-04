import {Component, OnDestroy, OnInit} from '@angular/core';

import {ApiService} from '../api/services/api.service';
import {BlockListItem} from '../api/models/block-list-item';
import {BlocksRequest} from '../api/models/blocks-request';
import {Title} from '@angular/platform-browser';
import {TranslateService} from '@ngx-translate/core';
import {Subscription} from 'rxjs';
import download from 'downloadjs';


@Component({
  selector: 'app-blocks-list',
  templateUrl: './blocks-list.component.html',
  styleUrls: ['./blocks-list.component.scss']
})
export class BlocksListComponent implements OnInit, OnDestroy {

  private langSubscription: Subscription;

  currentLang: string;

  showEmptyBlocks = false;

  loading = false;

  newCount = 0;

  blocks: BlockListItem[];
  pageSize = 20;
  page = 1;

  request: BlocksRequest = {skipEmpty: false, limit: this.pageSize, offset: this.pageSize * (this.page - 1)};

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
    this.loadData();
  }

  setTitle() {
    this.translateService.get('blocks-list.title').toPromise().then(l => {
      this.titleService.setTitle(l);
    });
  }

  loadData() {
    this.loading = true;
    this.request.limit = this.pageSize;
    this.request.offset = this.pageSize * (this.page - 1);
    this.request.skipEmpty = !this.showEmptyBlocks;

    this.apiService.postApiBlockList({body: this.request}).toPromise().then(blocks => {
        this.blocks = blocks;
        this.loading = false;
    });
  }

  changePageSize() {
    this.page = 1;
    this.loadData();
  }

  hasNextPage() {
    return true;
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
      'common.ID',
      'blocks.workchain',
      'blocks.shard',
      'blocks.number',
      'blocks.transactions',
      'blocks.date-n-time'
    ];
    this.translateService.get(headersKeys).toPromise().then(headers => {
      result += headersKeys.map(k => '\"' + headers[k] + '\"').join(';') + '\n';
      this.blocks.forEach(b => {
        result += '\"' + b.roothash.toLowerCase() + '\";';
        result += '\"' + b.workchain + '\";';
        result += '\"' + b.shard.padStart(16, '0') + '\";';
        result += '\"' + b.seqno + '\";';
        result += '\"' + b.transactionsCount + '\";';
        result += '\"' + b.time + '\";\n';
      });
      download(result, 'blocks.csv', 'text/csv');
    });
  }

  ngOnDestroy(): void {
    if (this.langSubscription) {
      this.langSubscription.unsubscribe();
    }
  }
}

import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {ApiService} from '../api/services/api.service';
import {Block} from '../api/models/block';
import {Message} from '../api/models/message';
import {BlockId} from '../api/models/block-id';
import {transactionUtils} from '../transaction-utils';

import BigNumber from 'bignumber.js';

import namedAddresses from '../named-addresses';
import {decOfNum} from '../decOfNum';
import {Title} from '@angular/platform-browser';
import {TranslateService} from '@ngx-translate/core';

interface TransactionMessage extends Message {
  transactionHash: string;
}

@Component({
  selector: 'app-block-page',
  templateUrl: './block-page.component.html',
  styleUrls: ['./block-page.component.scss']
})
export class BlockPageComponent implements OnInit, OnDestroy {
  private langSubscription: Subscription;
  private routeParamsSubscription?: Subscription;

  namedAddresses = namedAddresses;
  decOfNum = decOfNum;

  error: number | undefined;
  block: Block;

  hasAccountBlocks: boolean;
  hasShardHashes: boolean;
  hasTransactions: boolean;
  hasMessages: boolean;

  messagesIn: TransactionMessage[];
  messagesOut: TransactionMessage[];

  transactionCount: number;
  messageCount: number;
  parentCount: number;

  genValidatorListHashShort: string;
  genSoftwareCapabilities: string;

  balanceChanges: string[];

  moreInfoOpen = false;

  @ViewChild('mainDetails') mainDetails: ElementRef;
  @ViewChild('valueFlow') valueFlow: ElementRef;
  @ViewChild('accountBlocks') accountBlocks: ElementRef;
  @ViewChild('shardHashes') shardHashes: ElementRef;
  @ViewChild('transactions') transactions: ElementRef;
  @ViewChild('messages') messages: ElementRef;

  constructor(private apiService: ApiService,
              private route: ActivatedRoute,
              private router: Router,
              private titleService: Title,
              private translateService: TranslateService) {
  }

  ngOnInit(): void {
    this.initSubscription();
  }

  setTitle() {
    this.translateService.get('block-page.title', { hash: this.block.id.rootHash }).toPromise().then(l => {
      this.titleService.setTitle(l);
    });
  }

  initSubscription() {
    if (this.routeParamsSubscription) {
      this.routeParamsSubscription.unsubscribe();
    }
    this.routeParamsSubscription = this.route.paramMap.subscribe(paramsMap => {
      const id = paramsMap.get('id');
      if (id != null) {
        delete this.error;
        delete this.block;
        return this.loadData(id);
      }

      const workchain = parseInt(paramsMap.get('workchain'), 10);
      const shard = paramsMap.get('shard');
      const seqno = parseInt(paramsMap.get('seqno'), 10);
      if (workchain != null && shard != null && seqno != null) {
        delete this.error;
        delete this.block;
        return this.loadBlockId(workchain, shard, seqno);
      }

      this.error = 404;
    });
  }

  loadBlockId(workchain: number, shard: string, seqno: number) {
    this.apiService.postApiBlockBySeqno({
      body: {
        workchain,
        shard,
        seqno
      }
    }).toPromise().then(block => {
      this.parseBlock(block);
    }).catch(() => this.error = 404);
  }

  loadData(id: string) {
    this.apiService.postApiBlock({
      body: {id}
    }).toPromise().then(block => {
      this.parseBlock(block);
      if (this.langSubscription) {
        this.langSubscription.unsubscribe();
      }
      this.setTitle();
      this.langSubscription = this.translateService.onLangChange.subscribe(_ => {
        this.setTitle();
      });
    }).catch(() => this.error = 404);
  }

  parseBlock(block: Block) {
    this.block = block;

    this.hasAccountBlocks = block.blockExtra.accounts?.length > 0 || false;
    this.hasShardHashes = !block.info.notMaster;
    this.hasTransactions = block.transactions?.length > 0 || false;
    this.hasMessages = block.transactions?.some(transaction => transaction.messageIn != null || transaction.outMessageCount > 0) || false;

    [this.messagesIn, this.messagesOut] = block.transactions.reduce(([messagesIn, messagesOut], transaction) => {
      if (transaction.messageIn != null) {
        messagesIn.push({...transaction.messageIn, transactionHash: transaction.hash});
      }
      if (transaction.messagesOut != null) {
        messagesOut.push(...transaction.messagesOut.map(message => ({
          ...message,
          transactionHash: transaction.hash
        })));
      }
      return [messagesIn, messagesOut];
    }, [[], []]);

    this.transactionCount = block.transactions.length;
    this.messageCount = this.messagesIn.length + this.messagesOut.length;
    this.parentCount = block.previous.length;

    // tslint:disable-next-line:no-bitwise
    this.genValidatorListHashShort = (block.info.genValidatorListHashShort >>> 0).toString();
    this.genSoftwareCapabilities = new BigNumber(block.info.genSoftware.capabilities).toString(16);

    this.balanceChanges = block.transactions
      .map(t => {
        return transactionUtils.balanceChange(t);
      });
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

  ngOnDestroy(): void {
    if (this.routeParamsSubscription) {
      this.routeParamsSubscription.unsubscribe();
    }
    if (this.langSubscription) {
      this.langSubscription.unsubscribe();
    }
  }

  async openBlockBySeqno(blockId: BlockId) {
    await this.router.navigateByUrl(`/blocks/${blockId.workchain}/${blockId.shard}/${blockId.seqno}`);
  }
}

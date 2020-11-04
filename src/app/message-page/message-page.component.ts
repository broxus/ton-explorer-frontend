import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Subscription} from 'rxjs';
import {Transaction} from '../api/models/transaction';
import {Message} from '../api/models/message';
import {ApiService} from '../api/services/api.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Title} from '@angular/platform-browser';
import {TranslateService} from '@ngx-translate/core';
import download from 'downloadjs';
import {MessageListItem} from '../api/models/message-list-item';
import {TransactionListItem} from '../api/models/transaction-list-item';

@Component({
  selector: 'app-message-page',
  templateUrl: './message-page.component.html',
  styleUrls: ['./message-page.component.scss']
})
export class MessagePageComponent implements OnInit, OnDestroy {

  private langSubscription: Subscription;
  private routeParamsSubscription?: Subscription;

  currentLang: string;

  transactionId: string;
  out: string;
  n: number | undefined;
  error: number | undefined;
  transaction: Transaction;
  message: Message;

  parentTransaction: TransactionListItem;
  childTransaction: TransactionListItem;

  additionalInfoOpen = false;

  @ViewChild('main') mainRef: ElementRef;

  constructor(private apiService: ApiService,
              private route: ActivatedRoute,
              private router: Router,
              private titleService: Title,
              private translateService: TranslateService) {
  }

  ngOnInit(): void {
    this.initSubscription();
  }

  initSubscription() {
    if (this.routeParamsSubscription) {
      this.routeParamsSubscription.unsubscribe();
    }
    this.routeParamsSubscription = this.route.paramMap.subscribe(paramsMap => {
      this.transactionId = paramsMap.get('transactionId');
      this.out = paramsMap.get('out');
      try {
        this.n = parseInt(paramsMap.get('n'), 10);
      } catch (e) {
      }
      if (this.transactionId && (this.out === 'in' || (this.out === 'out' && typeof (this.n) === 'number'))) {
        delete this.error;
        delete this.transaction;
        delete this.message;
        this.loadData();
      } else {
        this.error = 404;
      }
    });
  }

  loadData() {
    this.apiService.postApiTransaction({body: {id: this.transactionId}})
      .toPromise()
      .then(transaction => {
        this.transaction = transaction;
        if (this.out === 'in' && transaction.messageIn) {
          this.message = transaction.messageIn;
        } else if (this.out === 'out' && transaction.messagesOut && transaction.messagesOut[this.n]) {
          this.message = transaction.messagesOut[this.n];
        }
        if (this.message.info.kind === 'internal') {
          this.searchForParentAndChild();
        }
        this.currentLang = this.translateService.currentLang;
        if (this.langSubscription) {
          this.langSubscription.unsubscribe();
        }
        this.setTitle();
        this.langSubscription = this.translateService.onLangChange.subscribe(_ => {
          this.currentLang = this.translateService.currentLang;
          this.setTitle();
        });
      });
  }

  setTitle() {
    this.translateService.get('message-page.title.' + this.out, {
      messageHash: this.message.hash.toLowerCase(),
      transactionHash: this.transaction.hash.toLowerCase(),
      n: this.n
    }).toPromise().then(l => {
      this.titleService.setTitle(l);
    });
  }

  searchForParentAndChild() {
    this.apiService.postApiSearchMessage({
      body: {
        query: this.message.hash
      }
    }).toPromise().then(results => {
        if (results.length === 2) {
          const foundIn = results.find(e => e.message.out === false);
          const foundOut = results.find(e => e.message.out === true);
          if (foundIn && foundOut) {
            this.parentTransaction = foundOut.transaction;
            this.childTransaction = foundIn.transaction;
          }
        }
    });
  }

  downloadBody() {
    if (this.message.body) {
      download(this.message.body, this.message.hash + '.txt', 'text/plain');
    }
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

  isDefined(e: any) {
    return typeof (e) !== 'undefined' && e != null;
  }

  ngOnDestroy(): void {
    if (this.routeParamsSubscription) {
      this.routeParamsSubscription.unsubscribe();
    }
    if (this.langSubscription) {
      this.langSubscription.unsubscribe();
    }
  }

}

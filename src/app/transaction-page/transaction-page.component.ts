import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Subscription} from 'rxjs';
import {ApiService} from '../api/services/api.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Title} from '@angular/platform-browser';
import {TranslateService} from '@ngx-translate/core';
import {Transaction} from '../api/models/transaction';
import BigNumber from 'bignumber.js';
import {transactionUtils} from '../transaction-utils';

@Component({
  selector: 'app-transaction-page',
  templateUrl: './transaction-page.component.html',
  styleUrls: ['./transaction-page.component.scss']
})
export class TransactionPageComponent implements OnInit, OnDestroy {

  private langSubscription: Subscription;
  private routeParamsSubscription?: Subscription;

  currentLang: string;

  id: string;
  error: number | undefined;
  transaction: Transaction;
  balanceChange: string;
  valueSent: string;
  valueReceived: string;
  fees: string;

  otherFees: string;
  outFwdFee: string;

  additionalInfoOpen = false;
  hasStoragePhase: boolean;
  hasCreditPhase: boolean;
  hasComputePhase: boolean;
  hasAction: boolean;
  hasBounce: boolean;

  @ViewChild('main') mainRef: ElementRef;
  @ViewChild('messages') messages: ElementRef;
  @ViewChild('fees') feesRef: ElementRef;
  @ViewChild('storage') storage: ElementRef;
  @ViewChild('credit') credit: ElementRef;
  @ViewChild('compute') compute: ElementRef;
  @ViewChild('action') action: ElementRef;
  @ViewChild('bounce') bounce: ElementRef;
  @ViewChild('finalState') finalState: ElementRef;

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
    this.currentLang = this.translateService.currentLang;
    if (this.routeParamsSubscription) {
      this.routeParamsSubscription.unsubscribe();
    }
    this.routeParamsSubscription = this.route.paramMap.subscribe(paramsMap => {
      this.currentLang = this.translateService.currentLang;
      this.id = paramsMap.get('id');
      if (this.id) {
        delete this.error;
        delete this.transaction;
        this.loadData();
      } else {
        this.error = 404;
      }
    });
  }

  loadData() {
    this.apiService.postApiTransaction({body: {id: this.id}}).toPromise().then(transaction => {
      this.transaction = transaction;

      this.valueSent = transactionUtils.valueSent(transaction);
      this.valueReceived = transactionUtils.valueReceived(transaction);
      this.fees = transactionUtils.fees(transaction);
      this.balanceChange = transactionUtils.balanceChange(transaction);

      this.hasStoragePhase = transaction.description.storagePhase != null;
      this.hasCreditPhase = transaction.description.creditPhase != null;
      this.hasComputePhase = transaction.description.computePhase != null;
      this.hasAction = transaction.description.action != null;
      this.hasBounce = transaction.description.bounce != null;

      this.otherFees = [
        transaction.messageIn?.info?.importFee,
        transaction.messageIn?.info?.ihrFee
      ].reduce(
        (total, value) => {
          return value != null ? total.add(value) : total;
        },
        new BigNumber(0))
        .toString();

      this.outFwdFee = transaction.messagesOut
        .reduce((total, message) =>
            message.info?.fwdFee != null
              ? total.add(message.info.fwdFee)
              : total,
          new BigNumber(0))
        .sub(transaction.description.bounce?.fwdFees || 0)
        .toString();

      if (this.langSubscription) {
        this.langSubscription.unsubscribe();
      }
      this.setTitle();
      this.langSubscription = this.translateService.onLangChange.subscribe(_ => {
        this.setTitle();
      });
    });
  }

  setTitle() {
    this.translateService.get('transaction-page.title', this.transaction).toPromise().then(l => {
      this.titleService.setTitle(l);
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
}

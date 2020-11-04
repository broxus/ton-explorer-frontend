import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ApiService} from '../api/services/api.service';
import {Subscription} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {Account} from '../api/models/account';
import download from 'downloadjs';
import {Title} from '@angular/platform-browser';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-account-page',
  templateUrl: './account-page.component.html',
  styleUrls: ['./account-page.component.scss']
})
export class AccountPageComponent implements OnInit, OnDestroy {

  private langSubscription: Subscription;
  private routeParamsSubscription?: Subscription;

  currentLang: string;

  id: string;
  error: number | undefined;
  account: Account;

  isValidator = false;

  additionalInfoOpen = false;
  addressesBase64Open = false;

  @ViewChild('main') main: ElementRef;
  @ViewChild('transactions') transactions: ElementRef;
  @ViewChild('messages') messages: ElementRef;
  @ViewChild('stakeActions') stakeActions: ElementRef;

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
      this.id = paramsMap.get('id');
      if (this.id) {
        delete this.error;
        delete this.account;
        this.loadData();
      } else {
        this.error = 404;
      }
    });
  }

  loadData() {
    this.apiService.postApiAccount({body: {id: this.id}}).toPromise().then(account => {
      this.account = account;
      // this.apiService.postApiStakeTransactionCount({body: {account: {
      //       workchain: account.workchain,
      //       address: account.addressHex
      //     }}})
      //   .toPromise()
      //   .then(c => this.isValidator = c.count > 0);
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
    this.translateService.get('account-page.title', this.account).toPromise().then(l => {
      this.titleService.setTitle(l);
    });
  }

  downloadData() {
    if (this.account.state.data) {
      download(this.account.state.data,
        this.account.workchain + '_' + this.account.addressHex + '_data_' + new Date().getTime() + '.txt',
        'text/plain');
    }
  }

  downloadCode() {
    if (this.account.state.code) {
      download(this.account.state.code,
        this.account.workchain + '_' + this.account.addressHex + '_code_' + new Date().getTime() + '.txt',
        'text/plain');
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

  ngOnDestroy(): void {
    if (this.routeParamsSubscription) {
      this.routeParamsSubscription.unsubscribe();
    }
    if (this.langSubscription) {
      this.langSubscription.unsubscribe();
    }
  }

}

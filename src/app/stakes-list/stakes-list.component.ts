import {Component, OnDestroy, OnInit} from '@angular/core';
import {ApiService} from '../api/services/api.service';
import {Title} from '@angular/platform-browser';
import {TranslateService} from '@ngx-translate/core';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-stakes-list',
  templateUrl: './stakes-list.component.html',
  styleUrls: ['./stakes-list.component.scss']
})
export class StakesListComponent implements OnInit, OnDestroy {

  private langSubscription: Subscription;

  currentLang: string;

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
  }

  setTitle() {
    this.translateService.get('stakes-list.stake-actions.title').toPromise().then(l => {
      this.titleService.setTitle(l);
    });
  }

  ngOnDestroy(): void {
    if (this.langSubscription) {
      this.langSubscription.unsubscribe();
    }
  }
}

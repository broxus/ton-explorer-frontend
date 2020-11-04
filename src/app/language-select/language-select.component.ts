import { Component, OnInit } from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {CookieService} from 'ngx-cookie-service';

@Component({
  selector: 'app-language-select',
  templateUrl: './language-select.component.html',
  styleUrls: ['./language-select.component.scss']
})
export class LanguageSelectComponent implements OnInit {

  langTitles = {
    en: 'EN',
    ko: '한국어'
  };

  langs: string[];
  currentLang: string;

  constructor(private translate: TranslateService,
              private cookieService: CookieService) {
    this.currentLang = translate.currentLang;
    this.langs = this.translate.getLangs();
  }

  ngOnInit(): void {
  }

  setLang(newLang: string) {
    if (this.langs.indexOf(newLang) !== -1) {
      this.currentLang = newLang;
      this.translate.use(newLang);
      this.cookieService.set('locale', newLang, 365, '/');
    }
  }

}

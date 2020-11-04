import {Component} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {CookieService} from 'ngx-cookie-service';
import {BsLocaleService, defineLocale as bsDefineLocale} from 'ngx-bootstrap';
import {koLocale} from 'ngx-bootstrap/locale';
import 'moment/locale/ko';
import * as moment from 'moment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(private translate: TranslateService,
              private cookieService: CookieService,
              private bsLocaleService: BsLocaleService) {
    const locales = ['en', 'ko'];
    const defaultLocale = 'en';
    let localeFromCookies = this.cookieService.get('locale');
    let browserLocale = navigator.language || navigator.languages[0];
    if (locales.indexOf(localeFromCookies) === -1) {
      localeFromCookies = null;
    }
    if (locales.indexOf(browserLocale) === -1) {
      browserLocale = null;
    }
    bsDefineLocale('ko', koLocale);
    translate.addLangs(locales);
    const usedLocale = localeFromCookies || browserLocale || defaultLocale;
    this.cookieService.set('locale', usedLocale, 365, '/');
    moment.updateLocale('en', {
      longDateFormat: {
        LT: 'HH:mm',
        LTS: 'HH:mm:ss',
        L: 'YYYY-MM-DD',
        LL: 'dd MMMM YYYY',
        LLL: 'YYYY-MM-DD HH:mm',
        LLLL: 'YYYY-MM-DD HH:mm:ss',
        lll: 'DD MMM HH:mm',
        llll: 'DD MMM HH:mm:ss'
      }
    });
    moment.updateLocale('ko', {
      longDateFormat: {
        LT: 'HH시 mm분',
        LTS: 'HH시 mm분 ss초',
        L: 'YYYY.MM.DD.',
        LL: 'YYYY년 MMMM D일',
        LLL: 'YYYY년 MM월 DD일 HH시 mm분',
        LLLL: 'YYYY년 MM월 DD일 HH시 mm분 ss초',
        lll: 'MM월 DD일 HH시 mm분',
        llll: 'MM월 DD일 HH시 mm분 ss초'
      }
    });
    bsLocaleService.use(usedLocale);
    translate.use(usedLocale);

    translate.onLangChange.subscribe(e => {
      bsLocaleService.use(translate.currentLang);
    });
  }
}

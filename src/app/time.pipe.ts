import { Pipe, PipeTransform } from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import * as moment from 'moment';
import 'moment/locale/ko';
import {BehaviorSubject, Observable} from 'rxjs';

@Pipe({
  name: 'time'
})
export class TimePipe implements PipeTransform {

  constructor(private translate: TranslateService) {
  }

  transform(date: number, format?: string): Observable<string> {
    // format = format ? format : 'LLL';
    // return moment(new Date(date * 1000)).format(format);

    format = format ? format : 'LLLL';
    // get the initial value
    const initVal = moment(date * 1000).locale(this.translate.currentLang).format(format);
    // insert the value into a new behaviour subject. If the language changes, the behaviour subject will be
    // updated
    const momentObs = new BehaviorSubject<string>(initVal);
    this.translate.onLangChange.subscribe(() => {
      // format the new date according to the new locale
      const val = moment(date * 1000).locale(this.translate.currentLang).format(format);
      momentObs.next(val);
    });
    return momentObs; // needs to be piped into the async pipe
  }

}

import {Pipe, PipeTransform} from '@angular/core';
import BigNumber from 'bignumber.js';
import {DomSanitizer} from '@angular/platform-browser';

type Currency = 'TON';

@Pipe({
  name: 'amount'
})
export class AmountPipe implements PipeTransform {


  constructor(private domSanitizer: DomSanitizer) {
  }

  transform(v?: any, currency: Currency | null = null) {
    const value = !v ? '0' : v.toString();
    const isZero = value == null || value === '0';
    const parts = !isZero
      ? new BigNumber(value).div(1000000000).toString().split('.')
      : ['', '0'];
    return this.domSanitizer.bypassSecurityTrustHtml(
      parts[0].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') +
      (parts[1] ? `<span class="color-gray-600">${isZero ? '' : '.'}` + parts[1] + '</span>' : '') +
      (currency != null && !isZero ? ` ${currency}` : ''));
  }

}

import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'hash'
})
export class HashPipe implements PipeTransform {

  transform(value: string, size: number = 0): string {
    if (size === 0) {
      return value.toLowerCase();
    } else {
      return value.substr(0, size).toLowerCase() + '...' + value.substr(value.length - size, size).toLowerCase();
    }
  }

}

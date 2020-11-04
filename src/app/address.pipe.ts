import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'address'
})
export class AddressPipe implements PipeTransform {

  transform(value: string, size?: number, workchain?: number): string {
    const workchainPart = (typeof (workchain) === 'number' ? workchain + ':' : '');
    const hashPart = value.substr(0, size).toLowerCase() + '...' +
                     value.substr(value.length - size, size).toLowerCase();
    return workchainPart + hashPart;
  }

}

import {Pipe, PipeTransform} from '@angular/core';

type Mode = 'full' | 'short';

@Pipe({
  name: 'shard'
})
export class ShardPipe implements PipeTransform {

  transform(value: string, mode: Mode = 'short'): string {
    const shard = value.padStart(16, '0');
    if (mode === 'full') {
      return shard;
    } else {
      const lastNonZero = [...shard].reduce((last, character) => character !== '0' ? last + 1 : last, 0);
      return shard.substr(0, Math.max(2, lastNonZero));
    }
  }

}

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'infinitySymbol',
})
export class InfinitySymbolPipe implements PipeTransform {
  transform(str: string | null): string {
    if (str === 'null' || str === null) {
      return '';
    }

    while (str.includes('Infinity')) {
      str = str.replace('Infinity', '∞');
    }

    return str;
  }
}

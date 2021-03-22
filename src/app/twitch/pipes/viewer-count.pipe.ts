import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'viewerCount'
})
export class ViewerCountPipe implements PipeTransform {

  transform(viewers: string): string {
    if (!viewers) {
      return '0 viewers';
    }
    
    const n: string = this.kFormatter(parseInt(viewers) ?? 0);

    return `${n} viewers`;
  }

  kFormatter(num: number): string {
    return num > 999 
      ? (num / 1000).toFixed(1) + 'K' 
      : num.toString();
  }

}


import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'thumbnailImage'
})
export class ThumbnailImagePipe implements PipeTransform {

  transform(url: string, width: string, height: string): string {
    console.log(url);
    return url
      .replace('{width}', width)
      .replace('{height}', height);
  }

}

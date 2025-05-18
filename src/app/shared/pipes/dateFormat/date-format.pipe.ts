import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateFormat'
})
export class DateFormatPipe implements PipeTransform {

  transform(date: Date): string {
    if(isNaN(date.getTime())) return "";

    return date.toLocaleString('hu-HU',{
      year: 'numeric',
      month: 'long',
      day: '2-digit'
    }); 
  }
}

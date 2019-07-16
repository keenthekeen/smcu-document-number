import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment-timezone';

@Pipe({
  name: 'time'
})
export class TimePipe implements PipeTransform {
  transform(value: any, args?: any): any {
    return moment(value)
      .tz('Asia/Bangkok')
      .format('D MMMM Y HH:mm:ss ZZ');
  }
}

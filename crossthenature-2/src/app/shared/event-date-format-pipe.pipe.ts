import { Pipe, PipeTransform } from '@angular/core';
import { Event } from '../models/event';
import { format } from 'date-fns';

@Pipe({
  name: 'eventDateFormat',
})
export class EventDateFormatPipe implements PipeTransform {
  constructor() {}
  transform(event: Event): string {
    const date = format(new Date(event.date), 'eeeeee. d MMM yyyy / HH:mm');

    if (event.time_to) {
      return date + '-' + format(new Date(event.time_to), 'HH:mm');
    }
    return date + ' Uhr';
  }
}

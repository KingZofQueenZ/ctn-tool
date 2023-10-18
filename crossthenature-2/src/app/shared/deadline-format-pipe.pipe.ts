import { Pipe, PipeTransform } from '@angular/core';
import { format } from 'date-fns';

@Pipe({
  name: 'deadlineFormat',
})
export class DeadlineFormatPipe implements PipeTransform {
  constructor() {}
  transform(date: Date): string {
    return format(new Date(date), 'eeeeee. d MMM yyyy / HH:mm') + ' Uhr';
  }
}

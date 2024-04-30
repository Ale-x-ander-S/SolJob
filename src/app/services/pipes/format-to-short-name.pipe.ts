import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatToShortName',
  standalone: true
})

export class FormatToShortNamePipe implements PipeTransform {
  transform(firstName: string, lastName: string | undefined): string {
    if (!lastName) {
      return `${firstName}`;
    }
    return `${firstName} ${lastName.charAt(0)}`;
  }
}

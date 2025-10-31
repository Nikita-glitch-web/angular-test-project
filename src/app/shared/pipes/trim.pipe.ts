import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'trimText',
  standalone: true
})
export class TrimPipe implements PipeTransform {
  transform(title: string = '', summary: string = '', maxTitle = 30, maxTotal = 100) {
    const t = title.trim();
    const s = summary.trim();

    const titleTrimmed = t.length > maxTitle ? t.slice(0, maxTitle - 1) + '…' : t;
    const remaining = maxTotal - titleTrimmed.length;
    const summaryTrimmed = s.length > remaining ? s.slice(0, remaining - 1) + '…' : s;

    return { title: titleTrimmed, summary: summaryTrimmed };
  }
}

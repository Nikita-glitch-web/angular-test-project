import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({ name: 'highlight' })
export class HighlightPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(value: string | null | undefined, search: string | null | undefined): SafeHtml {
    if (!value) return '';
    if (!search) return value;

    const keywords = search.split(/[\s,]+/).filter(k => k.length);
    let result = value;

    keywords.forEach(k => {
      const regex = new RegExp(`(${k})`, 'gi');
      result = result.replace(regex, `<mark class="highlight">$1</mark>`);
    });

    return this.sanitizer.bypassSecurityTrustHtml(result);
  }
}

import { Component, Output, EventEmitter } from '@angular/core';
import { debounceTime, Subject } from 'rxjs';
import { CommonModule } from '@angular/common';
import { AppMaterialModule } from '../../../../app-material.module';

@Component({
  selector: 'app-search',
  templateUrl: './search.html',
  styleUrls: ['./search.scss'],
  imports: [
      CommonModule,
      AppMaterialModule,
  ],
})
export class SearchComponent {
  @Output() searchChange = new EventEmitter<string>();

  private search$ = new Subject<string>();

  constructor() {
    this.search$
      .pipe(debounceTime(300))
      .subscribe(term => this.searchChange.emit(term));
  }

  onInputChange(value: string) {
    this.search$.next(value);
  }
}

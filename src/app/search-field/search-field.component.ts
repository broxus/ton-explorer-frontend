import {Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import {ApiService} from '../api/services/api.service';
import {SearchResponse} from '../api/models/search-response';

@Component({
  selector: 'app-search-field',
  templateUrl: './search-field.component.html',
  styleUrls: ['./search-field.component.scss']
})
export class SearchFieldComponent implements OnInit {

  @ViewChild('searchWrapper') searchWrapper: ElementRef;

  query: string;
  prevQuery: string;
  result: SearchResponse;
  prevResult: SearchResponse;
  searchTimeout: any;

  @HostListener('document:click', ['$event'])
  onDocumentClick(e: MouseEvent) {
    if (!this.searchWrapper || !this.searchWrapper.nativeElement.contains(e.target)) {
      delete this.result;
    }
  }

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
  }

  search() {
    if (this.query && this.query.trim().length > 0) {
      if (this.searchTimeout) {
        clearTimeout(this.searchTimeout);
      }
      if (this.prevQuery !== this.query) {
        delete this.result;
        this.searchTimeout = setTimeout(() => {
          const query = this.query.trim();
          this.apiService.postApiSearch({body: {query}})
            .toPromise()
            .then(result => {
              this.result = result;
              this.prevQuery = query;
              this.prevResult = this.result;
            });
        }, 100);
      } else {
        this.result = this.prevResult;
      }
    } else if (this.prevQuery === this.query) {
      this.result = this.prevResult;
    } else {
      delete this.result;
    }
  }

}

import { Component } from '@angular/core';
import { LucideAngularModule, Search } from 'lucide-angular';

@Component({
  selector: 'app-list-search',
  imports: [LucideAngularModule],
  templateUrl: './list-search.html',
  styleUrl: './list-search.scss',
})
export class ListSearch {
  /**
   * Lucide Icon
   * @protected
   */
  protected readonly Search = Search;
}

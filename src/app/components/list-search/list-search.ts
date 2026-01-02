import { Component, EventEmitter, Output } from '@angular/core';
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

  /**
   * Event to send search queries to the parent component.
   */
  @Output() searchChange = new EventEmitter<string>();

  /**
   * Handles the search functionality by extracting the search query from the input field
   * and emitting the extracted value to the parent component.
   *
   * @param {Event} event - The input event triggered by the search field.
   * @return {void} - Does not return a value.
   */
  onSearch(event: Event) {
    // Extract the search query from the input field
    const inputElement = event.target as HTMLInputElement;
    // Send Text to the parent component
    this.searchChange.emit(inputElement.value);
  }
}

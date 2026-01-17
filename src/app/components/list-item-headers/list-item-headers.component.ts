import { Component, input } from '@angular/core';

@Component({
  selector: 'app-list-item-headers',
  imports: [],
  templateUrl: './list-item-headers.component.html',
  styleUrl: './list-item-headers.component.scss',
})
export class ListItemHeadersComponent {
  /**
   * Input: Properties for the list item headers.
   * @description header is for the displayed text of the list item.
   * @description Optional: headerSecondary is for the displayed secondary header of the list items.
   * @readonly
   */
  readonly header = input.required<string>();
  readonly header2 = input<string | null>(null);
  readonly header3 = input<string | null>(null);
}

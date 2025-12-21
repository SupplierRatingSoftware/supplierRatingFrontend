import { Component } from '@angular/core';
import { ListSearch } from '../../components/list-search/list-search';
import { AddBtn } from '../../components/add-btn/add-btn';
import { ListItem } from '../../components/list-item/list-item';

@Component({
  selector: 'app-orders',
  imports: [ListSearch, AddBtn, ListItem],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss',
})
export class OrdersComponent {}

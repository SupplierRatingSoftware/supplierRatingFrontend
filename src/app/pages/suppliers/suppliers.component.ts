import { Component } from '@angular/core';
import { ListSearch } from '../../components/list-search/list-search';
import { AddBtn } from '../../components/add-btn/add-btn';

@Component({
  selector: 'app-suppliers',
  imports: [ListSearch, AddBtn],
  templateUrl: './suppliers.component.html',
  styleUrl: './suppliers.component.scss',
})
export class SuppliersComponent {}

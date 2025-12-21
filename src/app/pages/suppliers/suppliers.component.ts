import { Component } from '@angular/core';
import { AddBtn } from '../../components/add-btn/add-btn';

@Component({
  selector: 'app-suppliers',
  imports: [AddBtn],
  templateUrl: './suppliers.component.html',
  styleUrl: './suppliers.component.scss',
})
export class SuppliersComponent {}

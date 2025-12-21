import { Component } from '@angular/core';
import { AddBtn } from '../../components/add-btn/add-btn';

@Component({
  selector: 'app-orders',
  imports: [AddBtn],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss',
})
export class OrdersComponent {}

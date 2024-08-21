import { Component, Input, OnInit } from '@angular/core';
import { Delivery } from '../../models/delivery.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-delivery-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './delivery-list.component.html',
  styleUrls: ['./delivery-list.component.css'],
})
export class DeliveryListComponent {
  @Input() deliveries: Delivery[] = [];
}

import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Package } from '../../models/package.model';

@Component({
  selector: 'app-package-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './package-list.component.html',
  styleUrls: ['./package-list.component.css'],
})
export class PackageListComponent {
  @Input() packages: Package[] = [];
}

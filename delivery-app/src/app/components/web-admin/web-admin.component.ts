import { Component } from '@angular/core';
import { DeliveryService } from '../../services/delivery.service';
import { Observable, of } from 'rxjs';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Delivery } from '../../models/delivery.model';
import { DeliveryListComponent } from '../delivery-list/delivery-list.component';
import { PackageListComponent } from '../package-list/package-list.component';
import { Package } from '../../models/package.model';
import { PackageService } from '../../services/package.service';

@Component({
  selector: 'app-web-admin',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    DeliveryListComponent,
    PackageListComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './web-admin.component.html',
  styleUrls: ['./web-admin.component.css'],
})
export class WebAdminComponent {
  packages: Package[] = [];
  deliveries: Delivery[] = [];
  newPackage: any = {};
  newDelivery: any = { package_id: '' };
  packageSuggestions$: Observable<any[]>;
  searchQuery: string = '';
  packageForm!: FormGroup;
  deliveryForm!: FormGroup;
  filteredPackages: any[] = [];
  selectedPackage: any;
  isModalOpen = false;
  constructor(
    private deliveryService: DeliveryService,
    private packageService: PackageService
  ) {
    this.loadPackages();
    this.loadDeliveries();
    this.packageSuggestions$ = new Observable();
  }

  ngOnInit(): void {
    this.initializeForm();
    this.initializeDeliveryForm();
  }

  initializeDeliveryForm(): void {
    this.deliveryForm = new FormGroup({
      package: new FormControl('', [Validators.required]),
    });
  }

  initializeForm(): void {
    this.packageForm = new FormGroup({
      description: new FormControl('', [Validators.required]),
      weight: new FormControl('', [Validators.required, Validators.min(1)]),
      width: new FormControl('', [Validators.required, Validators.min(1)]),
      height: new FormControl('', [Validators.required, Validators.min(1)]),
      depth: new FormControl('', [Validators.required, Validators.min(1)]),
      from_name: new FormControl('', [Validators.required]),
      from_address: new FormControl('', [Validators.required]),
      from_location_lat: new FormControl('', [
        Validators.required,
        Validators.min(0),
      ]),
      from_location_lng: new FormControl('', [
        Validators.required,
        Validators.min(0),
      ]),
      to_name: new FormControl('', [Validators.required]),
      to_address: new FormControl('', [Validators.required]),
      to_location_lat: new FormControl('', [
        Validators.required,
        Validators.min(0),
      ]),
      to_location_lng: new FormControl('', [
        Validators.required,
        Validators.min(0),
      ]),
    });
  }

  openModal(): void {
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
  }

  onSubmit(): void {
    if (this.packageForm.valid) {
      const {
        from_location_lat,
        from_location_lng,
        to_location_lat,
        to_location_lng,
      } = this.packageForm.value;
      const packageData = {
        ...this.packageForm.value,
        from_location: {
          lat: from_location_lat,
          lng: from_location_lng,
        },
        to_location: {
          lat: to_location_lat,
          lng: to_location_lng,
        },
      };
      this.packageService.createPackage(packageData).subscribe({
        next: (response) => {
          this.packages.push(response);
          this.packageForm.reset();
          this.closeModal();
        },
        error: (error) => {
          console.error('Error creating package', error);
        },
      });
    }
  }

  onPackageSearch(): void {
    const searchTerm = this.deliveryForm.get('package')?.value.toLowerCase();
    if (searchTerm) {
      this.packageService.searchPackages(searchTerm, true).subscribe((pkgs) => {
        this.filteredPackages = pkgs;
      });
    } else {
      this.filteredPackages = [];
    }
  }

  onPackageSelect(pkg: any): void {
    this.selectedPackage = pkg;
    this.deliveryForm.patchValue({ package: pkg.description });
    this.filteredPackages = [];
  }
  onSubmitDelivery(): void {
    if (this.deliveryForm.valid && this.selectedPackage) {
      const deliveryData = {
        package_id: this.selectedPackage.package_id,
      };
      this.deliveryService.createDelivery(deliveryData).subscribe({
        next: (response) => {
          this.deliveries.push(response);
          this.deliveryForm.reset();
          this.closeModal();
        },
        error: (error) => {
          console.error('Error creating delivery', error);
        },
      });
    }
  }
  loadPackages() {
    this.packageService.getAllPackages().subscribe((packages) => {
      this.packages = packages;
    });
  }

  loadDeliveries() {
    this.deliveryService.getAllDeliveries().subscribe((deliveries) => {
      this.deliveries = deliveries;
    });
  }

  createPackage() {
    this.packageService.createPackage(this.newPackage).subscribe(() => {
      this.loadPackages();
      this.newPackage = {};
    });
  }

  createDelivery() {
    this.deliveryService.createDelivery(this.newDelivery).subscribe(() => {
      this.loadDeliveries();
      this.newDelivery = { package_id: '' };
    });
  }
}

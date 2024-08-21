import { Component, OnDestroy, OnInit } from '@angular/core';
import { DeliveryService } from '../../services/delivery.service';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { Subscription } from 'rxjs';
import { PackageService } from '../../services/package.service';
import { WebSocketService } from '../../services/websocket.service';
import { GoogleMapsModule } from '@angular/google-maps';

@Component({
  selector: 'app-web-tracker',
  standalone: true,
  imports: [FormsModule, CommonModule, GoogleMapsModule, ReactiveFormsModule],
  templateUrl: './web-tracker.component.html',
  styleUrls: ['./web-tracker.component.css'],
})
export class WebTrackerComponent implements OnInit, OnDestroy {
  package: any;
  delivery: any;
  map: google.maps.Map | null = null;
  locationSubscription: Subscription = new Subscription();
  statusSubscription: Subscription = new Subscription();
  failed = false;
  delivered = false;
  pickedUp = false;
  inTransit = false;
  zoom = 10;
  packageForm: FormGroup;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private packageService: PackageService,
    private deliveryService: DeliveryService,
    private webSocketService: WebSocketService
  ) {
    this.packageForm = this.fb.group({
      packageId: [''],
    });
  }

  ngOnInit(): void {
    this.listenToWebSocketUpdates();
  }

  onSubmit() {
    const packageId = this.packageForm.value.packageId.trim();
    this.packageService.getPackageById(packageId).subscribe({
      next: (data) => {
        this.package = data;
        this.errorMessage = null;
        if (data.active_delivery_id) {
          this.deliveryService
            .getDeliveryById(data.active_delivery_id)
            .subscribe({
              next: (deliveryData) => {
                this.initMap();
                this.delivery = deliveryData;
                this.updateStatusColor(this.delivery.status);
                this.updateMap(this.delivery.location);
              },
              error: () => {
                this.delivery = null;
                this.errorMessage = 'Delivery not found';
              },
            });
        }
      },
      error: () => {
        this.package = null;
        this.errorMessage = 'Package not found';
      },
    });
  }

  ngOnDestroy(): void {
    this.locationSubscription.unsubscribe();
    this.statusSubscription.unsubscribe();
  }

  updateStatusColor(statusText: string): void {
    this.failed = false;
    this.inTransit = false;
    this.delivered = false;
    this.pickedUp = false;

    switch (statusText) {
      case 'failed':
        this.failed = true;
        break;
      case 'delivered':
        this.delivered = true;
        break;
      case 'in-transit':
        this.inTransit = true;
        break;
      case 'picked-up':
        this.pickedUp = true;
        break;
      case 'open':
        break;
      default:
        break;
    }
  }

  private initMap(): void {
    const mapOptions: google.maps.MapOptions = {
      center: new google.maps.LatLng(37.7749, -122.4194),
      zoom: this.zoom,
      mapId: 'WEB_TRACKER',
    };

    const mapElement = document.getElementById('map');

    if (mapElement) {
      this.map = new google.maps.Map(mapElement, mapOptions);

      if (this.map) {
        navigator.geolocation.getCurrentPosition((position) => {
          this.map?.setCenter({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        });
      }
    }
  }

  private updateMap(location: any): void {
    if (this.map && this.package) {
      const originPinBackground = new google.maps.marker.PinElement({
        background: '#e8cec8',
      });
      const destinationPinBackground = new google.maps.marker.PinElement({
        background: '#0ba075',
      });
      new google.maps.marker.AdvancedMarkerElement({
        position: {
          lat: this.package.from_location.lat,
          lng: this.package.from_location.lng,
        },
        map: this.map,
        title: 'Package Origin',
        content: originPinBackground.element,
      });
      new google.maps.marker.AdvancedMarkerElement({
        position: {
          lat: this.package.to_location.lat,
          lng: this.package.to_location.lng,
        },
        map: this.map,
        title: 'Package Destination',
        content: destinationPinBackground.element,
      });

      new google.maps.marker.AdvancedMarkerElement({
        position: { lat: location.lat, lng: location.lng },
        map: this.map,
        title: 'Current Location',
      });

      this.map.setCenter({ lat: location.lat, lng: location.lng });
    }
  }

  private listenToWebSocketUpdates(): void {
    this.locationSubscription = this.webSocketService
      .getMessages()
      .subscribe((message) => {
        if (
          message.event === 'delivery_updated' &&
          message.delivery_object.delivery_id.trim() ===
            this.package?.active_delivery_id
        ) {
          this.delivery = message.delivery_object;
          this.updateMap(this.delivery.location);
        }
      });
  }
}

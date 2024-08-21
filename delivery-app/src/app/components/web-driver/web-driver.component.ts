import { Component } from '@angular/core';
import { DeliveryService } from '../../services/delivery.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { PackageService } from '../../services/package.service';
import { WebSocketService } from '../../services/websocket.service';
import { GoogleMapsModule } from '@angular/google-maps';

@Component({
  selector: 'app-web-driver',
  standalone: true,
  imports: [FormsModule, CommonModule, GoogleMapsModule],
  templateUrl: './web-driver.component.html',
  styleUrls: ['./web-driver.component.css'],
})
export class WebDriverComponent {
  deliveryId: string = '';
  zoom = 10;
  delivery: any;
  package: any = null;
  map: google.maps.Map | null = null;
  locationInterval: any;
  locationSubscription: Subscription = new Subscription();

  private wsSubject: any;

  constructor(
    private deliveryService: DeliveryService,
    private packageService: PackageService,
    private webSocketService: WebSocketService
  ) {}

  ngOnInit(): void {
    this.initMap();
  }

  ngOnDestroy(): void {
    this.locationSubscription.unsubscribe();
    if (this.locationInterval) {
      clearInterval(this.locationInterval);
    }
  }

  loadDelivery(): void {
    if (this.deliveryId.trim()) {
      this.deliveryService
        .getDeliveryById(this.deliveryId.trim())
        .subscribe((delivery) => {
          this.delivery = delivery;
          this.packageService
            .getPackageById(delivery.package_id)
            .subscribe((pkg) => {
              navigator.geolocation.getCurrentPosition((position) => {
                delivery.location = {
                  lat: position.coords.latitude,
                  lng: position.coords.longitude,
                };
              });
              this.package = pkg;
              this.initMap();
              this.updateMap(
                delivery.location,
                pkg.from_location,
                pkg.to_location
              );
              if (['picked-up', 'in-transit'].includes(this.delivery.status)) {
                this.startLocationTracking();
              }
              this.listenToWebSocketUpdates();
            });
        });
    }
  }

  private initMap(): void {
    const mapOptions: google.maps.MapOptions = {
      zoom: this.zoom,
      center: new google.maps.LatLng(37.7749, -122.4194),
      mapId: 'WEB_DRIVER',
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

  private updateMap(
    currentLocation: any,
    fromLocation: any,
    toLocation: any
  ): void {
    if (this.map) {
      this.map.setZoom(this.map.getZoom() ?? this.zoom);
      const originPinBackground = new google.maps.marker.PinElement({
        background: '#e8cec8',
      });
      const destinationPinBackground = new google.maps.marker.PinElement({
        background: '#0ba075',
      });
      new google.maps.marker.AdvancedMarkerElement({
        position: { lat: fromLocation.lat, lng: fromLocation.lng },
        map: this.map,
        title: 'Package Origin',
        content: originPinBackground.element,
      });
      new google.maps.marker.AdvancedMarkerElement({
        position: { lat: toLocation.lat, lng: toLocation.lng },
        map: this.map,
        title: 'Package Destination',
        content: destinationPinBackground.element,
      });

      new google.maps.marker.AdvancedMarkerElement({
        position: { lat: currentLocation.lat, lng: currentLocation.lng },
        map: this.map,
        title: 'Current Location',
      });

      this.map.setCenter({
        lat: currentLocation.lat,
        lng: currentLocation.lng,
      });
    }
  }

  private startLocationTracking(): void {
    this.locationInterval = setInterval(() => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            const location = { lat: latitude, lng: longitude };
            this.updateMap(
              location,
              this.package.from_location,
              this.package.to_location
            );
            this.webSocketService.sendMessage({
              event: 'location_changed',
              delivery_id: this.deliveryId.trim(),
              location: location,
            });
          },
          (error) => console.error('Error getting location', error)
        );
      } else {
        console.error('Geolocation not supported');
      }
    }, 20000);
  }

  private listenToWebSocketUpdates(): void {
    this.wsSubject = this.webSocketService.getMessages();
    this.locationSubscription = this.wsSubject.subscribe((message: any) => {
      if (
        message.event === 'location_changed' &&
        message.delivery_id.trim() === this.deliveryId.trim()
      ) {
        this.updateMap(
          message.location,
          this.package.from_location,
          this.package.to_location
        );
      }
    });
  }

  changeStatus(status: string): void {
    this.delivery.status = status;
    if (['picked-up', 'in-transit'].includes(this.delivery.status)) {
      this.startLocationTracking();
    }

    this.webSocketService.sendMessage({
      event: 'status_changed',
      delivery_id: this.deliveryId.trim(),
      status: status,
    });

    if (status === 'picked-up') {
      this.delivery.pickup_time = new Date();
    } else if (status === 'in-transit') {
      this.delivery.start_time = new Date();
    } else if (status === 'delivered' || status === 'failed') {
      this.delivery.end_time = new Date();
    }
  }
}

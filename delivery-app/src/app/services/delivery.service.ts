import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { WebSocketSubject } from 'rxjs/webSocket';

@Injectable({
  providedIn: 'root',
})
export class DeliveryService {
  private apiUrl = 'http://localhost:5000/api/delivery';
  private wsUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) {}
  connectWebSocket(deliveryId: string): WebSocketSubject<any> {
    return new WebSocketSubject(`${this.wsUrl}/${deliveryId}`);
  }

  getAllDeliveries(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  getDeliveryById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  createDelivery(deliveryData: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, deliveryData);
  }

  updateDelivery(id: string, deliveryData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, deliveryData);
  }

  deleteDelivery(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}

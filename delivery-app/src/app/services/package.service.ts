import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PackageService {
  private apiUrl = 'http://localhost:5000/api/package';

  constructor(private http: HttpClient) {}

  getAllPackages(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  getPackageById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  createPackage(packageData: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, packageData);
  }

  updatePackage(id: string, packageData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, packageData);
  }

  deletePackage(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

  searchPackages(query: string, isOpen?: boolean): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/search`, {
      params: { q: query, ...(isOpen && { isOpen }) },
    });
  }
}

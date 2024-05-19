import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environtment';
import { AuthService } from './auth.service';
import { Movements } from '../models/movements';
import { Product } from '../models/product';

@Injectable({
  providedIn: 'root'
})
export class MovementsService {
  baseUrl: string = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {
  }

  getProductMovementsByID(id: number) {
    const headers = this.authService.getAuthHeaders();
    return this.http.get<{ 'movements': Movements[], 'product': Product }>(`${this.baseUrl}/movements/${id}`, headers);
  }

  simulate(dados: object) {
    const headers = this.authService.getAuthHeaders();
    return this.http.post<{ 'success': boolean }>(`${this.baseUrl}/movements/simulate`, dados , headers);
  }
}

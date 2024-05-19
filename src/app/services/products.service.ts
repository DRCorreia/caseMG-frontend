import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Product } from '../models/product';
import { environment } from 'src/environments/environtment';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  baseUrl: string = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {
  }

  getProducts() {
    const headers = this.authService.getAuthHeaders();
    return this.http.get<Product[]>(`${this.baseUrl}/products`, headers);
  }

  getProductById(id: number) {
    const headers = this.authService.getAuthHeaders();
    return this.http.get<Product>(`${this.baseUrl}/products/${id}`, headers);
  }

  createProduct(dados: FormData) {
    const headers = this.authService.getAuthHeadersImg();
    return this.http.post<Product>(`${this.baseUrl}/products/new`, dados, headers);
  }

  updateProduct(dados: FormData, productId: number) {
    const headers = this.authService.getAuthHeadersImg();
    return this.http.post<Product>(`${this.baseUrl}/products/${productId}`, dados, headers);
  }

  deleteProduct(productId: number) {
    const headers = this.authService.getAuthHeaders();
    return this.http.delete<{'success' : boolean}>(`${this.baseUrl}/products/delete/${productId}`, headers);
  }
}

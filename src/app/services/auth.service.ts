import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environtment';
import { Form } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  baseUrl: string = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  getAuthHeaders() {
    const token = localStorage.getItem('access_token');

    return {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }),
    };
  }

  getAuthHeadersImg() {
    const token = localStorage.getItem('access_token');
    return {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`,
      }),
    };
  }

  login(email: string, password: string) {
    const requestBody = {
      email: email,
      password: password
    }

    return this.http.post<{ 'access_token': string, 'token_type': string }>(`${this.baseUrl}/login`, requestBody);
  }

  logout() {
    return this.http.post<{ 'success': boolean }>(`${this.baseUrl}/logout`, {} ,this.getAuthHeaders());
  }

  register(registerForm: Form){
    return this.http.post<{ 'success': boolean }>(`${this.baseUrl}/register`, registerForm ,this.getAuthHeaders());
  }

  setToken(token: string): void {
    localStorage.setItem('access_token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  removeToken(){
    localStorage.removeItem('access_token');
  }

}

// src/services/admin.service.ts - SIMPLE VERSION
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private readonly ADMIN_PASSWORD = 'admin123'; // Change this!

  authenticate(password: string): boolean {
    if (password === this.ADMIN_PASSWORD) {
      sessionStorage.setItem('admin_auth', 'true');
      return true;
    }
    return false;
  }

  isAuthenticated(): boolean {
    return sessionStorage.getItem('admin_auth') === 'true';
  }

  logout(): void {
    sessionStorage.removeItem('admin_auth');
  }
}

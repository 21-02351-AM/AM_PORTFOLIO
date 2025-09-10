// src/guards/admin-auth.guard.ts - SIMPLE VERSION
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AdminAuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    // Simple check - the component will handle authentication
    return true; // Let the component handle login
  }
}

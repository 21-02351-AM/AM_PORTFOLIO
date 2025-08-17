import { Component } from '@angular/core';

@Component({
  selector: 'app-navbar',
  standalone: false,
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  scrollTo(sectionId: string) {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  isMobileMenuOpen = false;
  mobileMenuAnimating = false;

  toggleMobileMenu() {
    if (this.isMobileMenuOpen) {
      this.mobileMenuAnimating = true;
      this.isMobileMenuOpen = false;
      setTimeout(() => (this.mobileMenuAnimating = false), 500);
    } else {
      this.isMobileMenuOpen = true;
      this.mobileMenuAnimating = true;
    }
  }

  scrollToMobile(section: string) {
    this.scrollTo(section);
    this.toggleMobileMenu();
  }
}

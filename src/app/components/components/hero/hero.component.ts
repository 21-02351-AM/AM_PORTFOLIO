import { Component, OnInit } from '@angular/core';
import {
  ImageManagementService,
  ImageData,
} from '../../../../services/image-management.service';

@Component({
  selector: 'app-hero',
  standalone: false,
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.css',
})
export class HeroComponent implements OnInit {
  // Hero image - only one allowed
  heroImage: ImageData | null = null;
  isLoadingImage = false;

  // Fallback image
  fallbackImageUrl = 'assets/your-image.jpg';

  constructor(private imageService: ImageManagementService) {}

  async ngOnInit() {
    await this.loadHeroImage();
  }

  // Load the single hero image from database
  async loadHeroImage() {
    this.isLoadingImage = true;

    try {
      console.log('Loading hero image from database...');

      // Get 'hero' type images from the database
      const heroImages = await this.imageService.getImagesByType('hero');
      console.log('Found hero images:', heroImages.length);

      if (heroImages && heroImages.length > 0) {
        // Always use the first (and should be only) hero image
        this.heroImage = heroImages[0];
        console.log('Using hero image:', this.heroImage.alt);
      } else {
        console.log('No hero image found, using fallback');
        this.heroImage = null;
      }
    } catch (error) {
      console.error('Error loading hero image:', error);
      this.heroImage = null;
    } finally {
      this.isLoadingImage = false;
    }
  }

  // Get the image URL to display
  getHeroImageUrl(): string {
    return this.heroImage?.url || this.fallbackImageUrl;
  }

  // Get the image alt text
  getHeroImageAlt(): string {
    return this.heroImage?.alt || 'Profile Image';
  }

  // Scroll to section
  scrollTo(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest',
      });
    }
  }

  // Handle image loading errors
  onImageError(event: any) {
    console.log('Hero image failed to load, using fallback');
    event.target.src = this.fallbackImageUrl;
  }
}

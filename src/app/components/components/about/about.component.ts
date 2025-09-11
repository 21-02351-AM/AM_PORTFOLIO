import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  ImageManagementService,
  ImageData,
} from '../../../../services/image-management.service';

@Component({
  selector: 'app-about',
  standalone: false,
  templateUrl: './about.component.html',
  styleUrl: './about.component.css',
})
export class AboutComponent implements OnInit, OnDestroy {
  showAllSkills = false;
  currentImageIndex = 0;
  isAutoPlaying = true;
  autoPlayDuration = 3000; // 3 seconds

  private autoPlayInterval: any;
  private touchStartX = 0;
  private touchEndX = 0;
  private isDragging = false;
  private minSwipeDistance = 50;

  // Dynamic images from database
  carouselImages: ImageData[] = [];
  isLoadingImages = false;

  // Fallback images if database is empty
  fallbackImages: ImageData[] = [
    {
      id: 'fallback-1',
      name: 'fallback-1',
      url: 'https://i.pinimg.com/736x/7a/aa/0d/7aaa0d087145bfa953daa8e1270137ad.jpg',
      alt: 'About Me - Fallback Photo 1',
      type: 'about',
      title: 'Fallback Image',
      description: 'Default image while loading from database',
    },
    {
      id: 'fallback-2',
      name: 'fallback-2',
      url: 'https://i.pinimg.com/736x/7a/aa/0d/7aaa0d087145bfa953daa8e1270137ad.jpg',
      alt: 'About Me - Fallback Photo 2',
      type: 'about',
      title: 'Fallback Image',
      description: 'Default image while loading from database',
    },
  ];

  constructor(private imageService: ImageManagementService) {}

  async ngOnInit() {
    await this.loadImages();
    this.startAutoPlay();
  }

  ngOnDestroy() {
    this.stopAutoPlay();
  }

  // Load images from database
  async loadImages() {
    this.isLoadingImages = true;

    try {
      console.log('Loading about images from database...');

      // Get 'about' type images from the database
      const aboutImages = await this.imageService.getImagesByType('about');
      console.log('Loaded about images:', aboutImages);

      if (aboutImages && aboutImages.length > 0) {
        this.carouselImages = aboutImages;
        console.log(
          'Using database images:',
          this.carouselImages.length,
          'images'
        );
      } else {
        // Use fallback images if none found in database
        console.log('No about images found in database, using fallback images');
        this.carouselImages = this.fallbackImages;
      }

      // Reset current index if it's out of bounds
      if (this.currentImageIndex >= this.carouselImages.length) {
        this.currentImageIndex = 0;
      }
    } catch (error) {
      console.error('Error loading about images:', error);
      // Use fallback images on error
      this.carouselImages = this.fallbackImages;
    } finally {
      this.isLoadingImages = false;
    }
  }

  // Skills functionality
  toggleSkills() {
    this.showAllSkills = !this.showAllSkills;
  }

  // Carousel navigation
  nextImage() {
    if (this.carouselImages.length === 0) return;

    this.currentImageIndex =
      (this.currentImageIndex + 1) % this.carouselImages.length;
    this.resetAutoPlay();
  }

  previousImage() {
    if (this.carouselImages.length === 0) return;

    this.currentImageIndex =
      this.currentImageIndex === 0
        ? this.carouselImages.length - 1
        : this.currentImageIndex - 1;
    this.resetAutoPlay();
  }

  goToImage(index: number) {
    if (index >= 0 && index < this.carouselImages.length) {
      this.currentImageIndex = index;
      this.resetAutoPlay();
    }
  }

  // Auto-play functionality
  startAutoPlay() {
    if (this.isAutoPlaying && this.carouselImages.length > 1) {
      this.autoPlayInterval = setInterval(() => {
        this.nextImage();
      }, this.autoPlayDuration);
    }
  }

  stopAutoPlay() {
    if (this.autoPlayInterval) {
      clearInterval(this.autoPlayInterval);
      this.autoPlayInterval = null;
    }
  }

  resetAutoPlay() {
    this.stopAutoPlay();
    if (this.isAutoPlaying && this.carouselImages.length > 1) {
      this.startAutoPlay();
    }
  }

  toggleAutoPlay() {
    this.isAutoPlaying = !this.isAutoPlaying;
    if (this.isAutoPlaying) {
      this.startAutoPlay();
    } else {
      this.stopAutoPlay();
    }
  }

  // Touch/Swipe functionality
  onTouchStart(event: TouchEvent) {
    this.touchStartX = event.touches[0].clientX;
    this.isDragging = true;
    this.stopAutoPlay();
  }

  onTouchMove(event: TouchEvent) {
    if (!this.isDragging) return;
    // Prevent default scrolling behavior during swipe
    event.preventDefault();
  }

  onTouchEnd(event: TouchEvent) {
    if (!this.isDragging) return;
    this.touchEndX = event.changedTouches[0].clientX;
    this.handleSwipe();
    this.isDragging = false;
    this.resetAutoPlay();
  }

  // Mouse drag functionality (for desktop)
  onMouseDown(event: MouseEvent) {
    this.touchStartX = event.clientX;
    this.isDragging = true;
    this.stopAutoPlay();
  }

  onMouseMove(event: MouseEvent) {
    if (!this.isDragging) return;
    event.preventDefault();
  }

  onMouseUp(event: MouseEvent) {
    if (!this.isDragging) return;
    this.touchEndX = event.clientX;
    this.handleSwipe();
    this.isDragging = false;
    this.resetAutoPlay();
  }

  private handleSwipe() {
    const swipeDistance = this.touchStartX - this.touchEndX;

    if (Math.abs(swipeDistance) < this.minSwipeDistance) {
      return; // Not enough distance for a swipe
    }

    if (swipeDistance > 0) {
      // Swiped left - go to next image
      this.nextImage();
    } else {
      // Swiped right - go to previous image
      this.previousImage();
    }
  }

  // Scroll functionality
  scrollTo(sectionId: string) {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  }

  // Refresh images manually (for testing)
  async refreshImages() {
    console.log('Manually refreshing images...');
    await this.loadImages();
  }
}

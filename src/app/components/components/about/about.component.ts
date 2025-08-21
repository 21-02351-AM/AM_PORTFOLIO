import { Component, OnDestroy, OnInit } from '@angular/core';

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

  carouselImages = [
    {
      url: 'https://i.pinimg.com/736x/7a/aa/0d/7aaa0d087145bfa953daa8e1270137ad.jpg',
      alt: 'About Me - Photo 1',
    },
    {
      url: 'https://i.pinimg.com/736x/7a/aa/0d/7aaa0d087145bfa953daa8e1270137ad.jpg',
      alt: 'About Me - Photo 2',
    },
    {
      url: 'https://i.pinimg.com/736x/7a/aa/0d/7aaa0d087145bfa953daa8e1270137ad.jpg',
      alt: 'About Me - Photo 3',
    },
    {
      url: 'https://i.pinimg.com/736x/7a/aa/0d/7aaa0d087145bfa953daa8e1270137ad.jpg',
      alt: 'About Me - Photo 4',
    },
  ];

  ngOnInit() {
    this.startAutoPlay();
  }

  ngOnDestroy() {
    this.stopAutoPlay();
  }

  // Skills functionality
  toggleSkills() {
    this.showAllSkills = !this.showAllSkills;
  }

  // Carousel navigation
  nextImage() {
    this.currentImageIndex =
      (this.currentImageIndex + 1) % this.carouselImages.length;
    this.resetAutoPlay();
  }

  previousImage() {
    this.currentImageIndex =
      this.currentImageIndex === 0
        ? this.carouselImages.length - 1
        : this.currentImageIndex - 1;
    this.resetAutoPlay();
  }

  goToImage(index: number) {
    this.currentImageIndex = index;
    this.resetAutoPlay();
  }

  // Auto-play functionality
  startAutoPlay() {
    if (this.isAutoPlaying) {
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
    if (this.isAutoPlaying) {
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
}

// projects.component.ts
import { Component, HostListener, OnInit, OnDestroy } from '@angular/core';

// Add this type definition at the top
type ScreenSize = 'mobile' | 'tablet' | 'desktop';

interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  emoji: string;
  techStack: TechTag[];
  buttons: ProjectButton[];
  stats: ProjectStats;
  year: string;
  gradients: ProjectGradients;
  borderColors: string[];
  liveUrl?: string; // Added for actual navigation
  githubUrl?: string; // Added for actual navigation
}

interface TechTag {
  name: string;
  gradient: string;
  borderColor: string;
  textColor: string;
  hoverGradient: string;
}

interface ProjectButton {
  text: string;
  bgColor: string;
  borderColor: string;
  textColor: string;
  hoverBgColor: string;
}

interface ProjectStats {
  icon: string;
  label: string;
  color: string;
}

interface ProjectGradients {
  card: string;
  title: string;
  titleHover: string;
  image: string;
}

@Component({
  selector: 'app-projects',
  standalone: false,
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.css',
})
export class ProjectsComponent implements OnInit, OnDestroy {
  // Carousel Properties
  currentIndex = 0;
  slideWidth = 100; // Base width percentage for single slide
  maxIndex = 0;
  autoSlideInterval?: ReturnType<typeof setInterval>;
  autoSlideDelay = 5000; // 5 seconds
  slidesToShow = 1; // Number of slides visible at once

  // Add this property to track screen size
  private currentScreenSize: ScreenSize = 'mobile';

  // Add touch/swipe properties
  private touchStartX = 0;
  private touchEndX = 0;
  private swipeThreshold = 50;
  private isSwipeEnabled = true;

  // Featured Projects Data
  featuredProjects: Project[] = [
    {
      id: 1,
      title: 'Photography Website',
      description:
        'A sample photography website where the owner can <span class="text-blue-300 font-medium">feature their work releated projects</span>.',
      image: 'project_images/Photo-web.png',
      emoji: '🎨',
      year: '2025',
      liveUrl: 'https://photography-ashy-six.vercel.app/',
      githubUrl: 'https://github.com/21-02351-AM/Photography',
      techStack: [
        {
          name: 'Angular',
          gradient: 'from-blue-400/10 to-purple-500/10',
          borderColor: 'border-blue-400/30',
          textColor: 'text-blue-300',
          hoverGradient: 'hover:from-blue-400/20 hover:to-purple-500/20',
        },
        {
          name: 'Tailwind CSS',
          gradient: 'from-purple-400/10 to-cyan-500/10',
          borderColor: 'border-purple-400/30',
          textColor: 'text-purple-300',
          hoverGradient: 'hover:from-purple-400/20 hover:to-cyan-500/20',
        },
        {
          name: 'PostgreSQL',
          gradient: 'from-cyan-400/10 to-blue-500/10',
          borderColor: 'border-cyan-400/30',
          textColor: 'text-cyan-300',
          hoverGradient: 'hover:from-cyan-400/20 hover:to-blue-500/20',
        },
        {
          name: 'Email JS',
          gradient: 'from-cyan-400/10 to-blue-500/10',
          borderColor: 'border-cyan-400/30',
          textColor: 'text-cyan-300',
          hoverGradient: 'hover:from-cyan-400/20 hover:to-blue-500/20',
        },
      ],
      buttons: [
        {
          text: 'Live Demo',
          bgColor: 'bg-blue-500/20',
          borderColor: 'border-blue-400/30',
          textColor: 'text-blue-300',
          hoverBgColor: 'hover:bg-blue-500/30',
        },
        {
          text: 'Source Code',
          bgColor: 'bg-purple-500/20',
          borderColor: 'border-purple-400/30',
          textColor: 'text-purple-300',
          hoverBgColor: 'hover:bg-purple-500/30',
        },
      ],
      stats: {
        icon: 'M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z',
        label: 'Personal Project',
        color: 'text-blue-300',
      },
      gradients: {
        card: 'from-blue-600/5 via-purple-400/5 to-cyan-500/5',
        title: 'from-blue-400 to-purple-500',
        titleHover: 'hover:from-blue-300 hover:to-purple-400',
        image: 'from-blue-500/20 via-purple-600/20 to-cyan-500/20',
      },
      borderColors: [
        'border-blue-400',
        'border-purple-400',
        'border-cyan-400',
        'border-blue-400',
      ],
    },
    {
      id: 2,
      title: 'Neon Dash',
      description:
        'A webgame developed using only <span class="text-purple-300 font-medium">HTML</span>, <span class="text-cyan-300 font-medium">CSS</span>, and <span class="text-blue-300 font-medium">JavaScript</span> . \n',
      image: 'project_images/neon-dash_image.png',
      emoji: '📱',
      year: '2025',
      liveUrl: 'https://neon-dash-beta.vercel.app/',
      githubUrl: 'https://github.com/21-02351-AM/Neon-dash',
      techStack: [
        {
          name: 'HTML',
          gradient: 'from-purple-400/10 to-cyan-500/10',
          borderColor: 'border-purple-400/30',
          textColor: 'text-purple-300',
          hoverGradient: 'hover:from-purple-400/20 hover:to-cyan-500/20',
        },
        {
          name: 'CSS',
          gradient: 'from-cyan-400/10 to-blue-500/10',
          borderColor: 'border-cyan-400/30',
          textColor: 'text-cyan-300',
          hoverGradient: 'hover:from-cyan-400/20 hover:to-blue-500/20',
        },
        {
          name: 'JavaScript',
          gradient: 'from-blue-400/10 to-purple-500/10',
          borderColor: 'border-blue-400/30',
          textColor: 'text-blue-300',
          hoverGradient: 'hover:from-blue-400/20 hover:to-purple-500/20',
        },
      ],
      buttons: [
        {
          text: 'Live Demo',
          bgColor: 'bg-purple-500/20',
          borderColor: 'border-purple-400/30',
          textColor: 'text-purple-300',
          hoverBgColor: 'hover:bg-purple-500/30',
        },
        {
          text: 'Source Code',
          bgColor: 'bg-cyan-500/20',
          borderColor: 'border-cyan-400/30',
          textColor: 'text-cyan-300',
          hoverBgColor: 'hover:bg-cyan-500/30',
        },
      ],
      stats: {
        icon: 'M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z',
        label: 'Popular',
        color: 'text-purple-300',
      },
      gradients: {
        card: 'from-purple-400/5 via-cyan-500/5 to-blue-600/5',
        title: 'from-purple-400 to-cyan-500',
        titleHover: 'hover:from-purple-300 hover:to-cyan-400',
        image: 'from-purple-500/20 via-blue-600/20 to-cyan-500/20',
      },
      borderColors: [
        'border-purple-400',
        'border-cyan-400',
        'border-blue-400',
        'border-purple-400',
      ],
    },
    {
      id: 3,
      title: 'Angeleyes',
      description: '<span class="text-blue-300 font-medium">Unknown</span>.',
      image: 'project_images/Angeleyes.png',
      emoji: '🎨',
      year: '2025',
      liveUrl: '/',
      githubUrl: 'https://github.com/21-02351-AM/Angeleyes',
      techStack: [
        {
          name: 'Python',
          gradient: 'from-cyan-400/10 to-blue-500/10',
          borderColor: 'border-cyan-400/30',
          textColor: 'text-cyan-300',
          hoverGradient: 'hover:from-cyan-400/20 hover:to-blue-500/20',
        },
      ],
      buttons: [
        {
          text: 'Live Demo',
          bgColor: 'bg-blue-500/20',
          borderColor: 'border-blue-400/30',
          textColor: 'text-blue-300',
          hoverBgColor: 'hover:bg-blue-500/30',
        },
        {
          text: 'Source Code',
          bgColor: 'bg-purple-500/20',
          borderColor: 'border-purple-400/30',
          textColor: 'text-purple-300',
          hoverBgColor: 'hover:bg-purple-500/30',
        },
      ],
      stats: {
        icon: 'M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z',
        label: 'Personal Project',
        color: 'text-blue-300',
      },
      gradients: {
        card: 'from-blue-600/5 via-purple-400/5 to-cyan-500/5',
        title: 'from-blue-400 to-purple-500',
        titleHover: 'hover:from-blue-300 hover:to-purple-400',
        image: 'from-blue-500/20 via-purple-600/20 to-cyan-500/20',
      },
      borderColors: [
        'border-blue-400',
        'border-purple-400',
        'border-cyan-400',
        'border-blue-400',
      ],
    },
  ];

  ngOnInit() {
    this.calculateCarouselSettings();
    this.startAutoSlide();
  }

  ngOnDestroy() {
    this.stopAutoSlide();
  }

  // Method called from template
  getScreenSize(): ScreenSize {
    return this.currentScreenSize;
  }

  // Touch event handlers called from template
  onTouchStart(event: TouchEvent) {
    if (!this.isSwipeEnabled || event.touches.length !== 1) return;
    this.touchStartX = event.touches[0].clientX;
    this.stopAutoSlide();
  }

  onTouchMove(event: TouchEvent) {
    if (!this.isSwipeEnabled || event.touches.length !== 1) return;
    event.preventDefault();
  }

  onTouchEnd(event: TouchEvent) {
    if (!this.isSwipeEnabled || event.changedTouches.length !== 1) return;
    this.touchEndX = event.changedTouches[0].clientX;
    this.handleSwipe();
    setTimeout(() => this.startAutoSlide(), 1000);
  }

  private handleSwipe() {
    const swipeDistance = this.touchStartX - this.touchEndX;
    const absDistance = Math.abs(swipeDistance);

    if (absDistance < this.swipeThreshold) return;

    if (swipeDistance > 0) {
      this.nextSlide(); // Swipe left
    } else {
      this.prevSlide(); // Swipe right
    }
  }

  // Calculate carousel settings based on screen size
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.calculateCarouselSettings();
  }

  // Update your calculateCarouselSettings method to set currentScreenSize
  private calculateCarouselSettings() {
    const screenWidth = window.innerWidth;

    // Added: set screen size bucket
    if (screenWidth < 640) {
      this.currentScreenSize = 'mobile';
    } else if (screenWidth < 1024) {
      this.currentScreenSize = 'tablet';
    } else {
      this.currentScreenSize = 'desktop';
    }

    // Existing logic for slidesToShow/slideWidth
    if (screenWidth >= 1280) {
      // XL screens: show 3 cards
      this.slidesToShow = 3;
      this.slideWidth = 100 / 3; // Each slide takes 33.33% width
    } else if (screenWidth >= 1024) {
      // LG screens: show 2 cards
      this.slidesToShow = 2;
      this.slideWidth = 100 / 2; // Each slide takes 50% width
    } else {
      // Mobile/tablet: show 1 card
      this.slidesToShow = 1;
      this.slideWidth = 100; // Each slide takes 100% width
    }

    // Calculate max index based on slides to show
    this.maxIndex = Math.max(
      0,
      this.featuredProjects.length - this.slidesToShow
    );

    // Reset current index if it exceeds the new max
    if (this.currentIndex > this.maxIndex) {
      this.currentIndex = this.maxIndex;
    }
  }

  // Auto-slide functionality
  private startAutoSlide() {
    this.stopAutoSlide(); // Clear any existing interval
    this.autoSlideInterval = setInterval(() => {
      this.nextSlide();
    }, this.autoSlideDelay);
  }

  private stopAutoSlide() {
    if (this.autoSlideInterval) {
      clearInterval(this.autoSlideInterval);
      this.autoSlideInterval = undefined;
    }
  }

  private resetAutoSlide() {
    this.stopAutoSlide();
    this.startAutoSlide();
  }

  // Carousel navigation methods
  nextSlide() {
    if (this.currentIndex < this.maxIndex) {
      this.currentIndex++;
    } else {
      this.currentIndex = 0; // Loop back to start
    }
    this.resetAutoSlide();
  }

  prevSlide() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    } else {
      this.currentIndex = this.maxIndex; // Loop to end
    }
    this.resetAutoSlide();
  }

  goToSlide(index: number) {
    if (index >= 0 && index <= this.maxIndex) {
      this.currentIndex = index;
      this.resetAutoSlide();
    }
  }

  // Helper method for indicators
  getIndicatorArray(): number[] {
    return Array(this.maxIndex + 1).fill(0);
  }

  // TrackBy function for optimal rendering performance
  trackByProjectId(index: number, project: Project): number {
    return project.id;
  }

  // Handle button clicks for Live Demo and Source Code
  onProjectButtonClick(project: Project, buttonText: string) {
    this.stopAutoSlide();

    const normalizedButtonText = (buttonText || '').toLowerCase();

    if (
      (normalizedButtonText.includes('demo') ||
        normalizedButtonText.includes('play')) &&
      project.liveUrl
    ) {
      window.open(project.liveUrl, '_blank', 'noopener,noreferrer');
    } else if (normalizedButtonText.includes('source') && project.githubUrl) {
      window.open(project.githubUrl, '_blank', 'noopener,noreferrer');
    }

    setTimeout(() => this.startAutoSlide(), 3000);
  }
}

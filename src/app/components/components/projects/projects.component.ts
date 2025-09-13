// projects.component.ts
import { Component, HostListener, OnInit, OnDestroy } from '@angular/core';
import {
  ImageManagementService,
  ImageData,
} from '../../../../services/image-management.service';

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
  liveUrl?: string;
  githubUrl?: string;
  project_id?: number; // Added to link with database
  alt: string; // Added for accessibility
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
  slideWidth = 100;
  maxIndex = 0;
  autoSlideInterval?: ReturnType<typeof setInterval>;
  autoSlideDelay = 5000;
  slidesToShow = 1;

  // Screen size and touch properties
  private currentScreenSize: ScreenSize = 'mobile';
  private touchStartX = 0;
  private touchEndX = 0;
  private swipeThreshold = 50;
  private isSwipeEnabled = true;

  // Loading state
  isLoading = true;

  // Database images
  projectImages: ImageData[] = [];

  // Featured Projects Data (with dynamic image loading)
  featuredProjects: Project[] = [
    {
      id: 1,
      title: 'Photography Website',
      description:
        'A sample photography website where the owner can <span class="text-blue-300 font-medium">feature their work related projects</span>.',
      image: '', // Will be loaded from database
      emoji: '🎨',
      year: '2025',
      liveUrl: 'https://photography-ashy-six.vercel.app/',
      githubUrl: 'https://github.com/21-02351-AM/Photography',
      project_id: 1,
      alt: 'Photography Website Project',
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
        'A webgame developed using only <span class="text-purple-300 font-medium">HTML</span>, <span class="text-cyan-300 font-medium">CSS</span>, and <span class="text-blue-300 font-medium">JavaScript</span>.',
      image: '',
      emoji: '📱',
      year: '2025',
      liveUrl: 'https://neon-dash-beta.vercel.app/',
      githubUrl: 'https://github.com/21-02351-AM/Neon-dash',
      project_id: 2,
      alt: 'Neon Dash Game Project',
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
      description:
        'A Python-based project with <span class="text-blue-300 font-medium">machine learning capabilities</span>.',
      image: '',
      emoji: '🔮',
      year: '2025',
      liveUrl: '/',
      githubUrl: 'https://github.com/21-02351-AM/Angeleyes',
      project_id: 3,
      alt: 'Angeleyes Python Project',
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

  constructor(private imageManagementService: ImageManagementService) {}

  async ngOnInit() {
    this.calculateCarouselSettings();
    await this.loadProjectImages();
    this.startAutoSlide();
  }

  ngOnDestroy() {
    this.stopAutoSlide();
  }

  // Load project images from database
  async loadProjectImages() {
    this.isLoading = true;
    try {
      // Load all project type images
      this.projectImages = await this.imageManagementService.getImagesByType(
        'project'
      );

      // Update featuredProjects with actual images from database
      this.updateProjectsWithDatabaseImages();
    } catch (error) {
      console.error('Error loading project images:', error);
    } finally {
      this.isLoading = false;
    }
  }

  // Update projects with images from database
  private updateProjectsWithDatabaseImages() {
    this.featuredProjects = this.featuredProjects.map((project) => {
      // Find matching image by project_id
      const matchingImage = this.projectImages.find(
        (img) => img.project_id === project.project_id
      );

      if (matchingImage) {
        return {
          ...project,
          image: matchingImage.url,
          title: matchingImage.title || project.title,
          description: matchingImage.description || project.description,
          alt: matchingImage.alt || project.alt,
        };
      }

      // If no matching image found, keep original (will show emoji fallback)
      return project;
    });
  }

  // Method called from template
  getScreenSize(): ScreenSize {
    return this.currentScreenSize;
  }

  // Touch event handlers
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
      this.nextSlide();
    } else {
      this.prevSlide();
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.calculateCarouselSettings();
  }

  private calculateCarouselSettings() {
    const screenWidth = window.innerWidth;

    if (screenWidth < 640) {
      this.currentScreenSize = 'mobile';
    } else if (screenWidth < 1024) {
      this.currentScreenSize = 'tablet';
    } else {
      this.currentScreenSize = 'desktop';
    }

    if (screenWidth >= 1280) {
      this.slidesToShow = 3;
      this.slideWidth = 100 / 3;
    } else if (screenWidth >= 1024) {
      this.slidesToShow = 2;
      this.slideWidth = 100 / 2;
    } else {
      this.slidesToShow = 1;
      this.slideWidth = 100;
    }

    this.maxIndex = Math.max(
      0,
      this.featuredProjects.length - this.slidesToShow
    );

    if (this.currentIndex > this.maxIndex) {
      this.currentIndex = this.maxIndex;
    }
  }

  private startAutoSlide() {
    this.stopAutoSlide();
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

  nextSlide() {
    if (this.currentIndex < this.maxIndex) {
      this.currentIndex++;
    } else {
      this.currentIndex = 0;
    }
    this.resetAutoSlide();
  }

  prevSlide() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    } else {
      this.currentIndex = this.maxIndex;
    }
    this.resetAutoSlide();
  }

  goToSlide(index: number) {
    if (index >= 0 && index <= this.maxIndex) {
      this.currentIndex = index;
      this.resetAutoSlide();
    }
  }

  getIndicatorArray(): number[] {
    return Array(this.maxIndex + 1).fill(0);
  }

  trackByProjectId(index: number, project: Project): number {
    return project.id;
  }

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

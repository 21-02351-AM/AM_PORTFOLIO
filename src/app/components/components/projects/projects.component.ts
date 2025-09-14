// projects.component.ts - FIXED VERSION
import { Component, HostListener, OnInit, OnDestroy } from '@angular/core';
import {
  ImageManagementService,
  ImageData,
} from '../../../../services/image-management.service';

type ScreenSize = 'mobile' | 'tablet' | 'desktop';

interface Project {
  id: string;
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
  project_id?: number;
  alt: string;
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

  // Projects loaded from database
  featuredProjects: Project[] = [];

  // Add polling interval to check for new projects
  private projectCheckInterval?: ReturnType<typeof setInterval>;

  // Default styling templates
  private defaultStyles = {
    gradients: [
      {
        card: 'from-blue-600/5 via-purple-400/5 to-cyan-500/5',
        title: 'from-blue-400 to-purple-500',
        titleHover: 'hover:from-blue-300 hover:to-purple-400',
        image: 'from-blue-500/20 via-purple-600/20 to-cyan-500/20',
      },
      {
        card: 'from-purple-400/5 via-cyan-500/5 to-blue-600/5',
        title: 'from-purple-400 to-cyan-500',
        titleHover: 'hover:from-purple-300 hover:to-cyan-400',
        image: 'from-purple-500/20 via-blue-600/20 to-cyan-500/20',
      },
      {
        card: 'from-cyan-600/5 via-blue-400/5 to-purple-500/5',
        title: 'from-cyan-400 to-blue-500',
        titleHover: 'hover:from-cyan-300 hover:to-blue-400',
        image: 'from-cyan-500/20 via-blue-600/20 to-purple-500/20',
      },
    ],
    borderColors: [
      [
        'border-blue-400',
        'border-purple-400',
        'border-cyan-400',
        'border-blue-400',
      ],
      [
        'border-purple-400',
        'border-cyan-400',
        'border-blue-400',
        'border-purple-400',
      ],
      [
        'border-cyan-400',
        'border-blue-400',
        'border-purple-400',
        'border-cyan-400',
      ],
    ],
    techColors: [
      {
        gradient: 'from-blue-400/10 to-purple-500/10',
        borderColor: 'border-blue-400/30',
        textColor: 'text-blue-300',
        hoverGradient: 'hover:from-blue-400/20 hover:to-purple-500/20',
      },
      {
        gradient: 'from-purple-400/10 to-cyan-500/10',
        borderColor: 'border-purple-400/30',
        textColor: 'text-purple-300',
        hoverGradient: 'hover:from-purple-400/20 hover:to-cyan-500/20',
      },
      {
        gradient: 'from-cyan-400/10 to-blue-500/10',
        borderColor: 'border-cyan-400/30',
        textColor: 'text-cyan-300',
        hoverGradient: 'hover:from-cyan-400/20 hover:to-blue-500/20',
      },
      {
        gradient: 'from-green-400/10 to-blue-500/10',
        borderColor: 'border-green-400/30',
        textColor: 'text-green-300',
        hoverGradient: 'hover:from-green-400/20 hover:to-blue-500/20',
      },
      {
        gradient: 'from-orange-400/10 to-red-500/10',
        borderColor: 'border-orange-400/30',
        textColor: 'text-orange-300',
        hoverGradient: 'hover:from-orange-400/20 hover:to-red-500/20',
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
  };

  constructor(private imageManagementService: ImageManagementService) {}

  async ngOnInit() {
    this.calculateCarouselSettings();
    await this.loadProjects();
    this.startAutoSlide();

    // Start polling for new projects every 5 seconds
    this.startProjectPolling();
  }

  ngOnDestroy() {
    this.stopAutoSlide();
    this.stopProjectPolling();
  }

  // Start polling for project updates
  private startProjectPolling() {
    this.projectCheckInterval = setInterval(async () => {
      await this.loadProjects(true); // Silent reload
    }, 5000); // Check every 5 seconds
  }

  // Stop polling
  private stopProjectPolling() {
    if (this.projectCheckInterval) {
      clearInterval(this.projectCheckInterval);
      this.projectCheckInterval = undefined;
    }
  }

  // Load all projects from database
  async loadProjects(silent: boolean = false) {
    if (!silent) {
      this.isLoading = true;
    }

    try {
      const projectImages = await this.imageManagementService.getImagesByType(
        'project'
      );
      const newProjects = this.transformImageDataToProjects(projectImages);

      // Check if projects have changed
      const projectsChanged = this.hasProjectsChanged(newProjects);

      if (projectsChanged) {
        this.featuredProjects = newProjects;

        // Recalculate carousel settings after projects change
        this.calculateCarouselSettings();

        // Reset carousel if needed
        if (this.currentIndex > this.maxIndex) {
          this.currentIndex = Math.max(0, this.maxIndex);
        }

        // Restart auto-slide to ensure it works with new data
        if (this.featuredProjects.length > 0) {
          this.resetAutoSlide();
        }

        console.log('Projects updated:', this.featuredProjects.length);
      }
    } catch (error) {
      console.error('Error loading projects:', error);
    } finally {
      if (!silent) {
        this.isLoading = false;
      }
    }
  }

  // Check if projects have changed
  private hasProjectsChanged(newProjects: Project[]): boolean {
    if (this.featuredProjects.length !== newProjects.length) {
      return true;
    }

    // Check if project IDs are different
    const currentIds = this.featuredProjects.map((p) => p.id).sort();
    const newIds = newProjects.map((p) => p.id).sort();

    return JSON.stringify(currentIds) !== JSON.stringify(newIds);
  }

  // Transform database ImageData to Project objects
  private transformImageDataToProjects(images: ImageData[]): Project[] {
    return images.map((image, index) => {
      const styleIndex = index % this.defaultStyles.gradients.length;

      // Parse tech stack from database or use empty array
      let techStack: TechTag[] = [];
      if (image.tech_stack && Array.isArray(image.tech_stack)) {
        techStack = (image.tech_stack as any[]).map((tech, techIndex) => ({
          name: tech.name || tech,
          ...this.defaultStyles.techColors[
            techIndex % this.defaultStyles.techColors.length
          ],
        }));
      }

      // Parse project data or use defaults
      let projectData: any = {};
      try {
        projectData =
          typeof image.project_data === 'string'
            ? JSON.parse(image.project_data)
            : image.project_data || {};
      } catch (e) {
        projectData = {};
      }

      const project: Project = {
        id: image.id,
        title: image.title || 'Untitled Project',
        description: image.description || 'No description available',
        image: image.url,
        alt: image.alt,
        emoji: (image as any).emoji || '🚀',
        year: (image as any).year || new Date().getFullYear().toString(),
        liveUrl: (image as any).live_url,
        githubUrl: (image as any).github_url,
        project_id: image.project_id,

        // Use saved styling or defaults
        gradients:
          projectData.gradients || this.defaultStyles.gradients[styleIndex],
        borderColors:
          projectData.borderColors ||
          this.defaultStyles.borderColors[styleIndex],

        techStack,

        buttons: projectData.buttons || this.defaultStyles.buttons,

        stats: projectData.stats || {
          icon: 'M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z',
          label: 'Project',
          color: 'text-blue-300',
        },
      };

      return project;
    });
  }

  getScreenSize(): ScreenSize {
    return this.currentScreenSize;
  }

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

    console.log('Carousel settings updated:', {
      screenWidth,
      slidesToShow: this.slidesToShow,
      maxIndex: this.maxIndex,
      currentIndex: this.currentIndex,
      projectCount: this.featuredProjects.length,
    });
  }

  private startAutoSlide() {
    this.stopAutoSlide();

    // Only start auto-slide if we have projects and can actually slide
    if (this.featuredProjects.length > this.slidesToShow) {
      this.autoSlideInterval = setInterval(() => {
        this.nextSlide();
      }, this.autoSlideDelay);
      console.log('Auto-slide started');
    }
  }

  private stopAutoSlide() {
    if (this.autoSlideInterval) {
      clearInterval(this.autoSlideInterval);
      this.autoSlideInterval = undefined;
      console.log('Auto-slide stopped');
    }
  }

  private resetAutoSlide() {
    console.log('Resetting auto-slide...');
    this.stopAutoSlide();
    // Small delay to ensure everything is properly updated
    setTimeout(() => {
      this.startAutoSlide();
    }, 100);
  }

  nextSlide() {
    if (this.featuredProjects.length === 0) return;

    if (this.currentIndex < this.maxIndex) {
      this.currentIndex++;
    } else {
      this.currentIndex = 0;
    }
    console.log('Next slide:', this.currentIndex, 'of', this.maxIndex);
    this.resetAutoSlide();
  }

  prevSlide() {
    if (this.featuredProjects.length === 0) return;

    if (this.currentIndex > 0) {
      this.currentIndex--;
    } else {
      this.currentIndex = this.maxIndex;
    }
    console.log('Prev slide:', this.currentIndex, 'of', this.maxIndex);
    this.resetAutoSlide();
  }

  goToSlide(index: number) {
    if (index >= 0 && index <= this.maxIndex) {
      this.currentIndex = index;
      console.log('Go to slide:', this.currentIndex);
      this.resetAutoSlide();
    }
  }

  getIndicatorArray(): number[] {
    return Array(this.maxIndex + 1).fill(0);
  }

  trackByProjectId(index: number, project: Project): string {
    return project.id;
  }

  onProjectButtonClick(project: Project, buttonText: string) {
    this.stopAutoSlide();

    const normalizedButtonText = (buttonText || '').toLowerCase();

    if (
      (normalizedButtonText.includes('demo') ||
        normalizedButtonText.includes('live') ||
        normalizedButtonText.includes('play')) &&
      project.liveUrl
    ) {
      window.open(project.liveUrl, '_blank', 'noopener,noreferrer');
    } else if (
      (normalizedButtonText.includes('source') ||
        normalizedButtonText.includes('code') ||
        normalizedButtonText.includes('github')) &&
      project.githubUrl
    ) {
      window.open(project.githubUrl, '_blank', 'noopener,noreferrer');
    }

    setTimeout(() => this.startAutoSlide(), 3000);
  }
}

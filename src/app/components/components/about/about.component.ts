// about.component.ts
import { Component, OnDestroy, OnInit } from '@angular/core';

interface Skill {
  name: string;
  gradient: string;
  border: string;
  text: string;
}

interface SkillCategory {
  title: string;
  icon: string;
  skills: Skill[];
}

@Component({
  selector: 'app-about',
  standalone: false,
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css'],
})
export class AboutComponent implements OnInit, OnDestroy {
  currentImageIndex = 0;
  isAutoPlaying = true;
  autoPlayDuration = 3000;
  expandedCategories: Set<number> = new Set([0]); // First category expanded by default

  private autoPlayInterval: any;
  private touchStartX = 0;
  private touchEndX = 0;
  private isDragging = false;
  private minSwipeDistance = 50;

  // Organized skill categories
  skillCategories: SkillCategory[] = [
    {
      title: 'Programming & Development',
      icon: '💻',
      skills: [
        {
          name: 'JavaScript',
          gradient: 'from-yellow-400/10 to-yellow-600/10',
          border: 'border-yellow-400/30',
          text: 'text-yellow-300',
        },
        {
          name: 'TypeScript',
          gradient: 'from-blue-400/10 to-blue-600/10',
          border: 'border-blue-400/30',
          text: 'text-blue-300',
        },
        {
          name: 'HTML',
          gradient: 'from-orange-400/10 to-orange-600/10',
          border: 'border-orange-400/30',
          text: 'text-orange-300',
        },
        {
          name: 'CSS',
          gradient: 'from-blue-500/10 to-blue-700/10',
          border: 'border-blue-500/30',
          text: 'text-blue-300',
        },
        {
          name: 'Tailwind CSS',
          gradient: 'from-cyan-400/10 to-cyan-600/10',
          border: 'border-cyan-400/30',
          text: 'text-cyan-300',
        },
      ],
    },
    {
      title: 'Frameworks & Libraries',
      icon: '⚛️',
      skills: [
        {
          name: 'Angular',
          gradient: 'from-red-400/10 to-red-600/10',
          border: 'border-red-400/30',
          text: 'text-red-300',
        },
        {
          name: 'React',
          gradient: 'from-cyan-400/10 to-cyan-600/10',
          border: 'border-cyan-400/30',
          text: 'text-cyan-300',
        },
        {
          name: 'Node.js',
          gradient: 'from-green-400/10 to-green-600/10',
          border: 'border-green-400/30',
          text: 'text-green-300',
        },
        {
          name: 'Django REST API',
          gradient: 'from-emerald-400/10 to-emerald-600/10',
          border: 'border-emerald-400/30',
          text: 'text-emerald-300',
        },
      ],
    },
    {
      title: 'Databases',
      icon: '🗄️',
      skills: [
        {
          name: 'Firebase',
          gradient: 'from-amber-400/10 to-amber-600/10',
          border: 'border-amber-400/30',
          text: 'text-amber-300',
        },
        {
          name: 'PostgreSQL',
          gradient: 'from-blue-400/10 to-indigo-600/10',
          border: 'border-blue-400/30',
          text: 'text-blue-300',
        },
        {
          name: 'MySQL',
          gradient: 'from-blue-500/10 to-blue-700/10',
          border: 'border-blue-500/30',
          text: 'text-blue-300',
        },
      ],
    },
    {
      title: 'Tools & Platforms',
      icon: '🛠️',
      skills: [
        {
          name: 'Git / GitHub',
          gradient: 'from-gray-400/10 to-gray-600/10',
          border: 'border-gray-400/30',
          text: 'text-gray-300',
        },
        {
          name: 'Postman',
          gradient: 'from-orange-400/10 to-orange-600/10',
          border: 'border-orange-400/30',
          text: 'text-orange-300',
        },
        {
          name: 'Jira',
          gradient: 'from-blue-400/10 to-blue-600/10',
          border: 'border-blue-400/30',
          text: 'text-blue-300',
        },
        {
          name: 'Notion',
          gradient: 'from-gray-400/10 to-gray-600/10',
          border: 'border-gray-400/30',
          text: 'text-gray-300',
        },
        {
          name: 'VS Code',
          gradient: 'from-blue-500/10 to-blue-700/10',
          border: 'border-blue-500/30',
          text: 'text-blue-300',
        },
      ],
    },
    {
      title: 'Web Development Skills',
      icon: '🌐',
      skills: [
        {
          name: 'RESTful API Integration',
          gradient: 'from-purple-400/10 to-purple-600/10',
          border: 'border-purple-400/30',
          text: 'text-purple-300',
        },
        {
          name: 'Responsive Web Design',
          gradient: 'from-pink-400/10 to-pink-600/10',
          border: 'border-pink-400/30',
          text: 'text-pink-300',
        },
        {
          name: 'Debugging & Troubleshooting',
          gradient: 'from-red-400/10 to-red-600/10',
          border: 'border-red-400/30',
          text: 'text-red-300',
        },
        {
          name: 'API Integration',
          gradient: 'from-indigo-400/10 to-indigo-600/10',
          border: 'border-indigo-400/30',
          text: 'text-indigo-300',
        },
        {
          name: 'Full-stack Web Development',
          gradient: 'from-violet-400/10 to-violet-600/10',
          border: 'border-violet-400/30',
          text: 'text-violet-300',
        },
      ],
    },
    {
      title: 'QA & Testing',
      icon: '🧪',
      skills: [
        {
          name: 'Manual Testing',
          gradient: 'from-teal-400/10 to-teal-600/10',
          border: 'border-teal-400/30',
          text: 'text-teal-300',
        },
        {
          name: 'API Testing',
          gradient: 'from-cyan-400/10 to-cyan-600/10',
          border: 'border-cyan-400/30',
          text: 'text-cyan-300',
        },
        {
          name: 'Bug Tracking',
          gradient: 'from-rose-400/10 to-rose-600/10',
          border: 'border-rose-400/30',
          text: 'text-rose-300',
        },
        {
          name: 'Test Documentation',
          gradient: 'from-sky-400/10 to-sky-600/10',
          border: 'border-sky-400/30',
          text: 'text-sky-300',
        },
      ],
    },
    {
      title: 'Design & Presentation',
      icon: '🎨',
      skills: [
        {
          name: 'PowerPoint Design',
          gradient: 'from-orange-400/10 to-orange-600/10',
          border: 'border-orange-400/30',
          text: 'text-orange-300',
        },
        {
          name: 'Multimedia Layout',
          gradient: 'from-pink-400/10 to-pink-600/10',
          border: 'border-pink-400/30',
          text: 'text-pink-300',
        },
        {
          name: 'UI/UX Awareness',
          gradient: 'from-purple-400/10 to-purple-600/10',
          border: 'border-purple-400/30',
          text: 'text-purple-300',
        },
      ],
    },
    {
      title: 'Soft Skills',
      icon: '🤝',
      skills: [
        {
          name: 'Problem Solving',
          gradient: 'from-emerald-400/10 to-emerald-600/10',
          border: 'border-emerald-400/30',
          text: 'text-emerald-300',
        },
        {
          name: 'Attention to Detail',
          gradient: 'from-amber-400/10 to-amber-600/10',
          border: 'border-amber-400/30',
          text: 'text-amber-300',
        },
        {
          name: 'Team Collaboration',
          gradient: 'from-blue-400/10 to-blue-600/10',
          border: 'border-blue-400/30',
          text: 'text-blue-300',
        },
        {
          name: 'Communication',
          gradient: 'from-cyan-400/10 to-cyan-600/10',
          border: 'border-cyan-400/30',
          text: 'text-cyan-300',
        },
        {
          name: 'Time Management',
          gradient: 'from-violet-400/10 to-violet-600/10',
          border: 'border-violet-400/30',
          text: 'text-violet-300',
        },
      ],
    },
  ];

  languages = [
    {
      name: 'English',
      level: 'Fluent',
      gradient: 'from-blue-400/10 to-blue-600/10',
      border: 'border-blue-400/30',
      text: 'text-blue-300',
    },
    {
      name: 'Tagalog',
      level: 'Native',
      gradient: 'from-red-400/10 to-yellow-600/10',
      border: 'border-red-400/30',
      text: 'text-red-300',
    },
  ];

  certifications = [
    { name: 'Elements of AI', issuer: 'University of Helsinki', year: '2025' },
    {
      name: 'Cybersecurity Fundamentals',
      issuer: 'Palo Alto Networks',
      year: '2024',
    },
    { name: 'CCNAv7', issuer: 'Cisco NetAcad', year: '2024' },
  ];

  carouselImages = [
    {
      url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800',
      alt: 'Software Development Workspace',
    },
    {
      url: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800',
      alt: 'Coding and Development',
    },
    {
      url: 'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=800',
      alt: 'Technology and Innovation',
    },
  ];

  ngOnInit() {
    this.startAutoPlay();
  }

  ngOnDestroy() {
    this.stopAutoPlay();
  }

  // Category toggle functionality
  toggleCategory(index: number) {
    if (this.expandedCategories.has(index)) {
      this.expandedCategories.delete(index);
    } else {
      this.expandedCategories.add(index);
    }
  }

  isCategoryExpanded(index: number): boolean {
    return this.expandedCategories.has(index);
  }

  expandAll() {
    this.skillCategories.forEach((_, index) => {
      this.expandedCategories.add(index);
    });
  }

  collapseAll() {
    this.expandedCategories.clear();
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
    event.preventDefault();
  }

  onTouchEnd(event: TouchEvent) {
    if (!this.isDragging) return;
    this.touchEndX = event.changedTouches[0].clientX;
    this.handleSwipe();
    this.isDragging = false;
    this.resetAutoPlay();
  }

  // Mouse drag functionality
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
      return;
    }
    if (swipeDistance > 0) {
      this.nextImage();
    } else {
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

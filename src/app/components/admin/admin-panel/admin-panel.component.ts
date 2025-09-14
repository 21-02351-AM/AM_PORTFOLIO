// src/app/components/admin/admin-panel/admin-panel.component.ts - ENHANCED FIXED
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  ImageManagementService,
  ImageData,
} from '../../../../services/image-management.service';

type ProjectStatus = 'Personal Project' | 'Popular' | 'Featured' | 'Work';
type GradientTheme = 'blue' | 'purple' | 'cyan' | 'green' | 'orange';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-panel.component.html',
  styleUrl: './admin-panel.component.css',
})
export class AdminPanelComponent implements OnInit {
  // Authentication
  isAuthenticated = false;
  password = '';
  private readonly ADMIN_PASSWORD = 'admin123';

  // Data
  images: ImageData[] = [];
  selectedType = 'all';
  message = '';
  isSuccess = false;
  isLoading = false;

  // Enhanced Form for complete project management
  uploadForm = {
    file: null as File | null,
    title: '',
    description: '',
    alt: '',
    type: 'hero' as 'hero' | 'about' | 'project' | 'carousel',
    project_id: undefined as number | undefined,

    // New project fields
    emoji: '',
    year: new Date().getFullYear().toString(),
    live_url: '',
    github_url: '',
    tech_stack: [] as string[],

    // Visual styling (will be stored as JSON)
    gradient_theme: 'blue' as GradientTheme,
    project_status: 'Personal Project' as ProjectStatus,
  };

  // Tech stack input
  newTech = '';

  editingImage: ImageData | null = null;

  imageTypes = [
    { value: 'hero', label: 'Hero (Profile Image - No Title/Description)' },
    { value: 'about', label: 'About (Carousel with Title/Description)' },
    { value: 'project', label: 'Project (Complete Project Info)' },
    { value: 'carousel', label: 'Carousel (With Title/Description)' },
  ];

  // Predefined gradient themes
  gradientThemes = {
    blue: {
      card: 'from-blue-600/5 via-purple-400/5 to-cyan-500/5',
      title: 'from-blue-400 to-purple-500',
      titleHover: 'hover:from-blue-300 hover:to-purple-400',
      image: 'from-blue-500/20 via-purple-600/20 to-cyan-500/20',
      borderColors: [
        'border-blue-400',
        'border-purple-400',
        'border-cyan-400',
        'border-blue-400',
      ],
    },
    purple: {
      card: 'from-purple-400/5 via-cyan-500/5 to-blue-600/5',
      title: 'from-purple-400 to-cyan-500',
      titleHover: 'hover:from-purple-300 hover:to-cyan-400',
      image: 'from-purple-500/20 via-blue-600/20 to-cyan-500/20',
      borderColors: [
        'border-purple-400',
        'border-cyan-400',
        'border-blue-400',
        'border-purple-400',
      ],
    },
    cyan: {
      card: 'from-cyan-600/5 via-blue-400/5 to-purple-500/5',
      title: 'from-cyan-400 to-blue-500',
      titleHover: 'hover:from-cyan-300 hover:to-blue-400',
      image: 'from-cyan-500/20 via-blue-600/20 to-purple-500/20',
      borderColors: [
        'border-cyan-400',
        'border-blue-400',
        'border-purple-400',
        'border-cyan-400',
      ],
    },
    green: {
      card: 'from-green-600/5 via-blue-400/5 to-cyan-500/5',
      title: 'from-green-400 to-blue-500',
      titleHover: 'hover:from-green-300 hover:to-blue-400',
      image: 'from-green-500/20 via-blue-600/20 to-cyan-500/20',
      borderColors: [
        'border-green-400',
        'border-blue-400',
        'border-cyan-400',
        'border-green-400',
      ],
    },
    orange: {
      card: 'from-orange-600/5 via-red-400/5 to-purple-500/5',
      title: 'from-orange-400 to-red-500',
      titleHover: 'hover:from-orange-300 hover:to-red-400',
      image: 'from-orange-500/20 via-red-600/20 to-purple-500/20',
      borderColors: [
        'border-orange-400',
        'border-red-400',
        'border-purple-400',
        'border-orange-400',
      ],
    },
  };

  constructor(private imageService: ImageManagementService) {}

  async ngOnInit() {
    this.checkAuth();
    if (this.isAuthenticated) {
      await this.loadImages();
    }
  }

  // Auth methods
  checkAuth() {
    this.isAuthenticated = sessionStorage.getItem('admin_auth') === 'true';
  }

  login() {
    if (this.password === this.ADMIN_PASSWORD) {
      this.isAuthenticated = true;
      sessionStorage.setItem('admin_auth', 'true');
      this.password = '';
      this.loadImages();
      this.showMessage('Login successful!', true);
    } else {
      this.showMessage('Wrong password!', false);
      this.password = '';
    }
  }

  logout() {
    this.isAuthenticated = false;
    sessionStorage.removeItem('admin_auth');
    this.showMessage('Logged out!', true);
  }

  // Images management
  async loadImages() {
    this.isLoading = true;
    try {
      this.images = await this.imageService.getImages();
      this.showMessage(`Loaded ${this.images.length} images`, true);
    } catch (error) {
      this.showMessage('Failed to load images', false);
    } finally {
      this.isLoading = false;
    }
  }

  get filteredImages() {
    if (this.selectedType === 'all') return this.images;
    return this.images.filter((img) => img.type === this.selectedType);
  }

  countByType(type: string) {
    return this.images.filter((img) => img.type === type).length;
  }

  get isHeroUploadDisabled(): boolean {
    return (
      this.uploadForm.type === 'hero' &&
      this.countByType('hero') >= 1 &&
      !this.editingImage
    );
  }

  get shouldShowTitleDescription(): boolean {
    return this.uploadForm.type !== 'hero';
  }

  get shouldShowProjectFields(): boolean {
    return this.uploadForm.type === 'project';
  }

  // Helper methods for template
  getImageEmoji(image: ImageData): string {
    return (image as any).emoji || '';
  }

  getImageYear(image: ImageData): string {
    return (image as any).year || '';
  }

  getImageLiveUrl(image: ImageData): string {
    return (image as any).live_url || '';
  }

  getImageGithubUrl(image: ImageData): string {
    return (image as any).github_url || '';
  }

  getImageTechStack(image: ImageData): any[] {
    const techStack = (image as any).tech_stack;
    return Array.isArray(techStack) ? techStack : [];
  }

  getProjectStatus(image: ImageData): string {
    const projectData = (image as any).project_data;
    return projectData?.stats?.label || '';
  }

  // Tech stack management
  addTech() {
    if (
      this.newTech.trim() &&
      !this.uploadForm.tech_stack.includes(this.newTech.trim())
    ) {
      this.uploadForm.tech_stack.push(this.newTech.trim());
      this.newTech = '';
    }
  }

  removeTech(index: number) {
    this.uploadForm.tech_stack.splice(index, 1);
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.uploadForm.file = file;
      if (!this.uploadForm.alt) {
        this.uploadForm.alt = file.name.replace(/\.[^/.]+$/, '');
      }
    }
  }

  onTypeChange() {
    // Clear title and description when switching to hero type
    if (this.uploadForm.type === 'hero') {
      this.uploadForm.title = '';
      this.uploadForm.description = '';
    }

    // Set default emoji for projects
    if (this.uploadForm.type === 'project' && !this.uploadForm.emoji) {
      this.uploadForm.emoji = '🚀';
    }
  }

  async uploadImage() {
    if (!this.uploadForm.file || !this.uploadForm.alt) {
      this.showMessage('Please fill all required fields', false);
      return;
    }

    // Check hero image limit
    if (this.uploadForm.type === 'hero' && this.countByType('hero') >= 1) {
      this.showMessage(
        'Only one hero image is allowed. Delete the existing one first.',
        false
      );
      return;
    }

    this.isLoading = true;
    try {
      const imageData: any = {
        alt: this.uploadForm.alt,
        type: this.uploadForm.type,
        project_id: this.uploadForm.project_id,
        order_index: this.images.length,
      };

      // Only add title/description for non-hero images
      if (this.uploadForm.type !== 'hero') {
        imageData.title = this.uploadForm.title;
        imageData.description = this.uploadForm.description;
      }

      // Add project-specific fields
      if (this.uploadForm.type === 'project') {
        imageData.emoji = this.uploadForm.emoji;
        imageData.year = this.uploadForm.year;
        imageData.live_url = this.uploadForm.live_url || null;
        imageData.github_url = this.uploadForm.github_url || null;
        imageData.tech_stack = this.uploadForm.tech_stack;

        // Create project_data with styling and metadata
        imageData.project_data = {
          gradients: this.gradientThemes[this.uploadForm.gradient_theme],
          borderColors:
            this.gradientThemes[this.uploadForm.gradient_theme].borderColors,
          buttons: [
            {
              text: 'Live Demo',
              bgColor: `bg-${this.uploadForm.gradient_theme}-500/20`,
              borderColor: `border-${this.uploadForm.gradient_theme}-400/30`,
              textColor: `text-${this.uploadForm.gradient_theme}-300`,
              hoverBgColor: `hover:bg-${this.uploadForm.gradient_theme}-500/30`,
            },
            {
              text: 'Source Code',
              bgColor: 'bg-purple-500/20',
              borderColor: 'border-purple-400/30',
              textColor: 'text-purple-300',
              hoverBgColor: 'hover:bg-purple-500/30',
            },
          ],
          stats: this.getStatsForProjectStatus(this.uploadForm.project_status),
        };
      }

      const result = await this.imageService.uploadImage(
        this.uploadForm.file,
        imageData
      );

      if (result) {
        this.showMessage(
          `${
            this.uploadForm.type === 'hero'
              ? 'Hero'
              : this.uploadForm.type === 'project'
              ? 'Project'
              : 'Image'
          } uploaded successfully!`,
          true
        );
        this.resetForm();
        await this.loadImages();
      } else {
        this.showMessage('Upload failed', false);
      }
    } catch (error) {
      this.showMessage('Upload failed', false);
    } finally {
      this.isLoading = false;
    }
  }

  editImage(image: ImageData) {
    this.editingImage = image;
    this.uploadForm = {
      file: null,
      title: image.title || '',
      description: image.description || '',
      alt: image.alt,
      type: image.type,
      project_id: image.project_id,
      emoji: this.getImageEmoji(image),
      year: this.getImageYear(image) || new Date().getFullYear().toString(),
      live_url: this.getImageLiveUrl(image),
      github_url: this.getImageGithubUrl(image),
      tech_stack: this.getImageTechStack(image),
      gradient_theme: this.detectGradientTheme(image),
      project_status: this.detectProjectStatus(image),
    };
  }

  async updateImage() {
    if (!this.editingImage || !this.uploadForm.alt) {
      this.showMessage('Please fill required fields', false);
      return;
    }

    this.isLoading = true;
    try {
      const updateData: any = {
        alt: this.uploadForm.alt,
        type: this.uploadForm.type,
        project_id: this.uploadForm.project_id,
      };

      // Only update title/description for non-hero images
      if (this.uploadForm.type !== 'hero') {
        updateData.title = this.uploadForm.title;
        updateData.description = this.uploadForm.description;
      } else {
        // Clear title/description for hero images
        updateData.title = null;
        updateData.description = null;
      }

      // Update project-specific fields
      if (this.uploadForm.type === 'project') {
        updateData.emoji = this.uploadForm.emoji;
        updateData.year = this.uploadForm.year;
        updateData.live_url = this.uploadForm.live_url || null;
        updateData.github_url = this.uploadForm.github_url || null;
        updateData.tech_stack = this.uploadForm.tech_stack;

        // Update project_data with new styling
        updateData.project_data = {
          gradients: this.gradientThemes[this.uploadForm.gradient_theme],
          borderColors:
            this.gradientThemes[this.uploadForm.gradient_theme].borderColors,
          buttons: [
            {
              text: 'Live Demo',
              bgColor: `bg-${this.uploadForm.gradient_theme}-500/20`,
              borderColor: `border-${this.uploadForm.gradient_theme}-400/30`,
              textColor: `text-${this.uploadForm.gradient_theme}-300`,
              hoverBgColor: `hover:bg-${this.uploadForm.gradient_theme}-500/30`,
            },
            {
              text: 'Source Code',
              bgColor: 'bg-purple-500/20',
              borderColor: 'border-purple-400/30',
              textColor: 'text-purple-300',
              hoverBgColor: 'hover:bg-purple-500/30',
            },
          ],
          stats: this.getStatsForProjectStatus(this.uploadForm.project_status),
        };
      }

      const result = await this.imageService.updateImage(
        this.editingImage.id,
        updateData
      );

      if (result) {
        this.showMessage('Image updated!', true);
        this.cancelEdit();
        await this.loadImages();
      } else {
        this.showMessage('Update failed', false);
      }
    } catch (error) {
      this.showMessage('Update failed', false);
    } finally {
      this.isLoading = false;
    }
  }

  async deleteImage(image: ImageData) {
    const confirmMessage =
      image.type === 'hero'
        ? `Delete the hero image "${image.alt}"? This will remove your profile picture.`
        : image.type === 'project'
        ? `Delete the project "${image.title || image.alt}"?`
        : `Delete "${image.alt}"?`;

    if (!confirm(confirmMessage)) return;

    this.isLoading = true;
    try {
      const success = await this.imageService.deleteImage(image.id);
      if (success) {
        this.showMessage(
          `${
            image.type === 'hero'
              ? 'Hero image'
              : image.type === 'project'
              ? 'Project'
              : 'Image'
          } deleted!`,
          true
        );
        await this.loadImages();
      } else {
        this.showMessage('Delete failed', false);
      }
    } catch (error) {
      this.showMessage('Delete failed', false);
    } finally {
      this.isLoading = false;
    }
  }

  cancelEdit() {
    this.editingImage = null;
    this.resetForm();
  }

  resetForm() {
    this.uploadForm = {
      file: null,
      title: '',
      description: '',
      alt: '',
      type: 'hero',
      project_id: undefined,
      emoji: '',
      year: new Date().getFullYear().toString(),
      live_url: '',
      github_url: '',
      tech_stack: [],
      gradient_theme: 'blue',
      project_status: 'Personal Project',
    };
    this.newTech = '';
    const fileInput = document.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  }

  get allImageTypes() {
    return [{ value: 'all', label: 'All Images' }, ...this.imageTypes];
  }

  get heroImageInfo(): string {
    const heroCount = this.countByType('hero');
    if (heroCount === 0) return 'No hero image uploaded';
    if (heroCount === 1) return 'Hero image set ✓';
    return `${heroCount} hero images (should be 1)`;
  }

  // Helper methods
  private getStatsForProjectStatus(status: ProjectStatus): any {
    const statsMap: Record<ProjectStatus, any> = {
      'Personal Project': {
        icon: 'M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z',
        label: 'Personal Project',
        color: 'text-blue-300',
      },
      Popular: {
        icon: 'M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z',
        label: 'Popular',
        color: 'text-purple-300',
      },
      Featured: {
        icon: 'M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z',
        label: 'Featured',
        color: 'text-yellow-300',
      },
      Work: {
        icon: 'M20 6L9 17l-5-5',
        label: 'Work Project',
        color: 'text-green-300',
      },
    };

    return statsMap[status] || statsMap['Personal Project'];
  }

  private detectGradientTheme(image: ImageData): GradientTheme {
    const projectData = (image as any).project_data;
    if (projectData && projectData.gradients) {
      const gradients = projectData.gradients;
      if (gradients.title.includes('purple')) return 'purple';
      if (gradients.title.includes('cyan')) return 'cyan';
      if (gradients.title.includes('green')) return 'green';
      if (gradients.title.includes('orange')) return 'orange';
    }
    return 'blue';
  }

  private detectProjectStatus(image: ImageData): ProjectStatus {
    const projectData = (image as any).project_data;
    if (projectData && projectData.stats) {
      const label = projectData.stats.label;
      if (label === 'Popular') return 'Popular';
      if (label === 'Featured') return 'Featured';
      if (label === 'Work Project') return 'Work';
    }
    return 'Personal Project';
  }

  private showMessage(text: string, success: boolean) {
    this.message = text;
    this.isSuccess = success;
    setTimeout(() => (this.message = ''), 4000);
  }
}

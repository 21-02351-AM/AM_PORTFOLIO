import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  ImageManagementService,
  ImageData,
} from '../../../../services/image-management.service';

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

  // Form
  uploadForm = {
    file: null as File | null,
    title: '',
    description: '',
    alt: '',
    type: 'hero' as 'hero' | 'about' | 'project' | 'carousel',
    project_id: undefined as number | undefined,
  };

  editingImage: ImageData | null = null;

  imageTypes = [
    { value: 'hero', label: 'Hero (Profile Image - No Title/Description)' },
    { value: 'about', label: 'About (Carousel with Title/Description)' },
    { value: 'project', label: 'Project (With Title/Description)' },
    { value: 'carousel', label: 'Carousel (With Title/Description)' },
  ];

  constructor(private imageService: ImageManagementService) {}

  async ngOnInit() {
    this.checkAuth();
    if (this.isAuthenticated) {
      await this.loadImages();
    }
  }

  // Auth
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

  // Images
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

  // Check if hero image upload is allowed
  get isHeroUploadDisabled(): boolean {
    return (
      this.uploadForm.type === 'hero' &&
      this.countByType('hero') >= 1 &&
      !this.editingImage
    );
  }

  // Check if title/description should be shown
  get shouldShowTitleDescription(): boolean {
    return this.uploadForm.type !== 'hero';
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

      const result = await this.imageService.uploadImage(
        this.uploadForm.file,
        imageData
      );

      if (result) {
        this.showMessage(
          `${
            this.uploadForm.type === 'hero' ? 'Hero' : 'Image'
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
        : `Delete "${image.alt}"?`;

    if (!confirm(confirmMessage)) return;

    this.isLoading = true;
    try {
      const success = await this.imageService.deleteImage(image.id);
      if (success) {
        this.showMessage(
          `${image.type === 'hero' ? 'Hero image' : 'Image'} deleted!`,
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
    };
    const fileInput = document.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  }

  get allImageTypes() {
    return [{ value: 'all', label: 'All Images' }, ...this.imageTypes];
  }

  private showMessage(text: string, success: boolean) {
    this.message = text;
    this.isSuccess = success;
    setTimeout(() => (this.message = ''), 4000);
  }

  // Get hero image info for display
  get heroImageInfo(): string {
    const heroCount = this.countByType('hero');
    if (heroCount === 0) return 'No hero image uploaded';
    if (heroCount === 1) return 'Hero image set ✓';
    return `${heroCount} hero images (should be 1)`;
  }
}

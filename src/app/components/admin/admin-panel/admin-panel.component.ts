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
  // Simple password protection
  isAuthenticated = false;
  password = '';
  private readonly ADMIN_PASSWORD = 'admin123'; // Change this!

  // Images data
  images: ImageData[] = [];
  selectedType = 'all';

  // Upload form
  uploadForm = {
    file: null as File | null,
    alt: '',
    type: 'hero' as 'hero' | 'about' | 'project' | 'carousel',
    project_id: undefined as number | undefined,
  };

  // Edit mode
  editingImage: ImageData | null = null;

  // Available types
  imageTypes = [
    { value: 'hero', label: 'Hero' },
    { value: 'about', label: 'About' },
    { value: 'project', label: 'Project' },
    { value: 'carousel', label: 'Carousel' },
  ];

  constructor(private imageService: ImageManagementService) {}

  async ngOnInit() {
    this.checkAuth();
    if (this.isAuthenticated) {
      await this.loadImages();
    }
  }

  // Authentication
  checkAuth() {
    this.isAuthenticated = sessionStorage.getItem('admin_auth') === 'true';
  }

  login() {
    if (this.password === this.ADMIN_PASSWORD) {
      this.isAuthenticated = true;
      sessionStorage.setItem('admin_auth', 'true');
      this.loadImages();
    } else {
      alert('Wrong password!');
    }
  }

  logout() {
    this.isAuthenticated = false;
    sessionStorage.removeItem('admin_auth');
  }

  // Image management
  async loadImages() {
    this.images = await this.imageService.getImages();
  }

  get filteredImages() {
    if (this.selectedType === 'all') {
      return this.images;
    }
    return this.images.filter((img) => img.type === this.selectedType);
  }

  countByType(type: string) {
    return this.images.filter((img) => img.type === type).length;
  }

  onFileSelected(event: any) {
    this.uploadForm.file = event.target.files[0];
    if (this.uploadForm.file && !this.uploadForm.alt) {
      this.uploadForm.alt = this.uploadForm.file.name.replace(/\.[^/.]+$/, '');
    }
  }

  async uploadImage() {
    if (!this.uploadForm.file) {
      alert('Please select a file');
      return;
    }

    const result = await this.imageService.uploadImage(this.uploadForm.file, {
      alt: this.uploadForm.alt,
      type: this.uploadForm.type,
      project_id: this.uploadForm.project_id,
      order_index: this.images.length,
    });

    if (result) {
      alert('Image uploaded!');
      this.resetForm();
      this.loadImages();
    } else {
      alert('Upload failed');
    }
  }

  editImage(image: ImageData) {
    this.editingImage = image;
    this.uploadForm = {
      file: null,
      alt: image.alt,
      type: image.type,
      project_id: image.project_id,
    };
  }

  async updateImage() {
    if (!this.editingImage) return;

    const result = await this.imageService.updateImage(this.editingImage.id, {
      alt: this.uploadForm.alt,
      type: this.uploadForm.type,
      project_id: this.uploadForm.project_id,
    });

    if (result) {
      alert('Image updated!');
      this.cancelEdit();
      this.loadImages();
    } else {
      alert('Update failed');
    }
  }

  async deleteImage(image: ImageData) {
    if (!confirm(`Delete "${image.alt}"?`)) return;

    const success = await this.imageService.deleteImage(image.id);
    if (success) {
      alert('Image deleted!');
      this.loadImages();
    } else {
      alert('Delete failed');
    }
  }

  cancelEdit() {
    this.editingImage = null;
    this.resetForm();
  }

  resetForm() {
    this.uploadForm = {
      file: null,
      alt: '',
      type: 'hero',
      project_id: undefined,
    };

    const fileInput = document.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  }

  async downloadBackup() {
    const images = await this.imageService.getImages();
    const backup = {
      images: images || this.images,
      date: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(backup, null, 2)], {
      type: 'application/json',
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `backup-${new Date().toDateString()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  // for fixing spread in *ngFor
  get allImageTypes() {
    return [{ value: 'all', label: 'All' }, ...this.imageTypes];
  }
}

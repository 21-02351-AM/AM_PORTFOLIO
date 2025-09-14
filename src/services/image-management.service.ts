// src/app/services/image-management.service.ts - UPDATED
import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { BehaviorSubject } from 'rxjs';

export interface ImageData {
  id: string;
  name: string;
  url: string;
  title?: string;
  description?: string;
  alt: string;
  type: 'hero' | 'about' | 'project' | 'carousel';
  project_id?: number;
  order_index?: number;
  created_at?: string;
  updated_at?: string;

  // New fields for complete project management
  emoji?: string;
  year?: string;
  live_url?: string;
  github_url?: string;
  tech_stack?: string[] | any[];
  project_data?: any; // JSONB field for buttons, gradients, stats, etc.
}

@Injectable({
  providedIn: 'root',
})
export class ImageManagementService {
  private imagesSubject = new BehaviorSubject<ImageData[]>([]);
  public images$ = this.imagesSubject.asObservable();

  constructor(private supabaseService: SupabaseService) {}

  // Get all images from database
  async getImages(): Promise<ImageData[]> {
    try {
      const { data, error } = await this.supabaseService.client
        .from('images')
        .select('*')
        .order('order_index', { ascending: true });

      if (error) throw error;

      this.imagesSubject.next(data || []);
      return data || [];
    } catch (error) {
      console.error('Error fetching images:', error);
      return [];
    }
  }

  // Get images by type (hero, about, project, carousel)
  async getImagesByType(type: string): Promise<ImageData[]> {
    try {
      const { data, error } = await this.supabaseService.client
        .from('images')
        .select('*')
        .eq('type', type)
        .order('order_index', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching images by type:', error);
      return [];
    }
  }

  // Get images by project ID
  async getProjectImages(projectId: number): Promise<ImageData[]> {
    try {
      const { data, error } = await this.supabaseService.client
        .from('images')
        .select('*')
        .eq('project_id', projectId)
        .order('order_index', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching project images:', error);
      return [];
    }
  }

  // Upload and save image with all project fields
  async uploadImage(
    file: File,
    imageData: Partial<ImageData>
  ): Promise<ImageData | null> {
    try {
      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random()
        .toString(36)
        .substr(2, 9)}.${fileExt}`;
      const filePath = `${imageData.type}/${fileName}`;

      // Upload to Supabase Storage
      const publicUrl = await this.supabaseService.uploadImage(
        file,
        'images',
        filePath
      );

      if (!publicUrl) {
        throw new Error('Failed to upload image');
      }

      // Prepare data for database insertion
      const dbData: any = {
        name: fileName,
        url: publicUrl,
        title: imageData.title || null,
        description: imageData.description || null,
        alt: imageData.alt || file.name,
        type: imageData.type,
        project_id: imageData.project_id,
        order_index: imageData.order_index || 0,
        emoji: imageData.emoji || null,
        year: imageData.year || null,
        live_url: imageData.live_url || null,
        github_url: imageData.github_url || null,
        tech_stack: imageData.tech_stack || null,
        project_data: imageData.project_data || null,
      };

      // Save to database
      const { data, error } = await this.supabaseService.client
        .from('images')
        .insert(dbData)
        .select()
        .single();

      if (error) throw error;

      // Update local state
      this.refreshImages();

      return data;
    } catch (error) {
      console.error('Error uploading image:', error);
      return null;
    }
  }

  // Update image data with all fields
  async updateImage(
    id: string,
    updates: Partial<ImageData>
  ): Promise<ImageData | null> {
    try {
      const updateData: any = {
        title: updates.title || null,
        description: updates.description || null,
        alt: updates.alt,
        type: updates.type,
        project_id: updates.project_id,
        emoji: updates.emoji || null,
        year: updates.year || null,
        live_url: updates.live_url || null,
        github_url: updates.github_url || null,
        tech_stack: updates.tech_stack || null,
        project_data: updates.project_data || null,
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await this.supabaseService.client
        .from('images')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      // Update local state
      this.refreshImages();

      return data;
    } catch (error) {
      console.error('Error updating image:', error);
      return null;
    }
  }

  // Delete image
  async deleteImage(id: string): Promise<boolean> {
    try {
      // First get the image data to get the storage path
      const { data: imageData, error: fetchError } =
        await this.supabaseService.client
          .from('images')
          .select('*')
          .eq('id', id)
          .single();

      if (fetchError) throw fetchError;

      // Extract storage path from URL
      const url = new URL(imageData.url);
      const pathParts = url.pathname.split('/');
      const storagePath = pathParts.slice(-2).join('/'); // Get last two parts: type/filename

      // Delete from storage
      const storageDeleted = await this.supabaseService.deleteImage(
        'images',
        storagePath
      );

      if (!storageDeleted) {
        console.warn(
          'Failed to delete image from storage, but continuing with database deletion'
        );
      }

      // Delete from database
      const { error } = await this.supabaseService.client
        .from('images')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Update local state
      this.refreshImages();

      return true;
    } catch (error) {
      console.error('Error deleting image:', error);
      return false;
    }
  }

  private async refreshImages(): Promise<void> {
    await this.getImages();
  }
}

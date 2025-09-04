import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(
      environment.supabase.url,
      environment.supabase.anonKey
    );
  }

  get client() {
    return this.supabase;
  }

  // Upload image to storage bucket
  async uploadImage(
    file: File,
    bucket: string,
    path: string
  ): Promise<string | null> {
    try {
      const { data, error } = await this.supabase.storage
        .from(bucket)
        .upload(path, file, {
          cacheControl: '3600',
          upsert: true,
        });

      if (error) throw error;

      // Get public URL
      const {
        data: { publicUrl },
      } = this.supabase.storage.from(bucket).getPublicUrl(path);

      return publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      return null;
    }
  }

  // Delete image from storage bucket
  async deleteImage(bucket: string, path: string): Promise<boolean> {
    try {
      const { error } = await this.supabase.storage.from(bucket).remove([path]);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting image:', error);
      return false;
    }
  }

  // Get public URL for an image
  getPublicUrl(bucket: string, path: string): string {
    const {
      data: { publicUrl },
    } = this.supabase.storage.from(bucket).getPublicUrl(path);

    return publicUrl;
  }

  // List files in a bucket
  async listFiles(bucket: string, folder?: string) {
    try {
      const { data, error } = await this.supabase.storage
        .from(bucket)
        .list(folder || '', {
          limit: 100,
          offset: 0,
        });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error listing files:', error);
      return [];
    }
  }
}

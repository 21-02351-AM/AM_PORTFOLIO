import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import emailjs, { EmailJSResponseStatus } from '@emailjs/browser';

@Component({
  selector: 'app-contact',
  standalone: false,
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css',
})
export class ContactComponent {
  contactForm: FormGroup;
  isSubmitting = false;

  // EmailJS configuration - Your actual IDs
  private readonly EMAIL_SERVICE_ID = 'service_b9zhugo';
  private readonly EMAIL_TEMPLATE_ID = 'template_b4pbk5j';
  private readonly EMAIL_PUBLIC_KEY = 'qnghcPOYjfkT6V_T3';
  private readonly AUTOREPLY_TEMPLATE_ID = 'template_shxyi4r';

  constructor(private fb: FormBuilder) {
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      message: ['', Validators.required],
    });

    // Initialize EmailJS
    emailjs.init(this.EMAIL_PUBLIC_KEY);
  }

  async onSubmit() {
    if (this.contactForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;

      try {
        const formData = this.contactForm.value;

        // Debug logging
        console.log('Submitting form with data:', formData);

        // Send the main email to yourself
        console.log('Sending contact email...');
        await this.sendContactEmail(formData);
        console.log('Contact email sent successfully');

        // Try to send auto-reply, but don't fail if it doesn't work
        try {
          console.log('Sending auto-reply...');
          await this.sendAutoReply(formData);
          console.log('Auto-reply sent successfully');
        } catch (autoReplyError) {
          console.warn(
            'Auto-reply failed, but main email succeeded:',
            autoReplyError
          );
          // Continue execution - main email success is what matters
        }

        // Success feedback
        this.showSuccessMessage(
          "Message sent successfully! I'll get back to you soon."
        );
        this.contactForm.reset();
      } catch (error) {
        console.error('Error sending main email:', error);

        // More detailed error handling
        if (error instanceof Error) {
          console.error('Error message:', error.message);
        }
        if (typeof error === 'object' && error !== null && 'text' in error) {
          console.error('EmailJS error:', (error as any).text);
        }

        this.showErrorMessage(
          'Failed to send message. Please try again or contact me directly at amb.lopez7@gmail.com'
        );
      } finally {
        this.isSubmitting = false;
      }
    } else {
      this.markFormGroupTouched();
    }
  }

  // Send the contact form data to your email
  private async sendContactEmail(
    formData: any
  ): Promise<EmailJSResponseStatus> {
    const templateParams = {
      from_name: formData.name,
      from_email: formData.email,
      message: formData.message,
      to_name: 'Alfred Miguel',
      to_email: 'amb.lopez7@gmail.com', // Add your email as recipient
      reply_to: formData.email,
      // Add current date/time
      sent_date: new Date().toLocaleDateString(),
      sent_time: new Date().toLocaleTimeString(),
    };

    console.log('Sending email with template params:', templateParams);
    console.log('Using service ID:', this.EMAIL_SERVICE_ID);
    console.log('Using template ID:', this.EMAIL_TEMPLATE_ID);

    try {
      const result = await emailjs.send(
        this.EMAIL_SERVICE_ID,
        this.EMAIL_TEMPLATE_ID,
        templateParams
      );
      console.log('Email sent successfully:', result);
      return result;
    } catch (error) {
      console.error('Error in sendContactEmail:', error);
      throw error;
    }
  }

  // Send auto-reply to the user
  private async sendAutoReply(formData: any): Promise<EmailJSResponseStatus> {
    const autoReplyParams = {
      from_name: formData.name,
      from_email: formData.email,
      to_name: 'Alfred Miguel',
      user_message: formData.message,
      reply_email: 'amb.lopez7@gmail.com', // Your email for replies
    };

    console.log('Sending auto-reply with params:', autoReplyParams);
    console.log('Using auto-reply template ID:', this.AUTOREPLY_TEMPLATE_ID);

    try {
      const result = await emailjs.send(
        this.EMAIL_SERVICE_ID,
        this.AUTOREPLY_TEMPLATE_ID,
        autoReplyParams
      );
      console.log('Auto-reply sent successfully:', result);
      return result;
    } catch (error) {
      console.error('Error in sendAutoReply:', error);
      // Don't throw error for auto-reply failure - main email is more important
      return {
        status: 0,
        text: 'Auto-reply failed but main email succeeded',
      } as EmailJSResponseStatus;
    }
  }

  // Helper method to mark all form fields as touched (for validation display)
  private markFormGroupTouched(): void {
    Object.keys(this.contactForm.controls).forEach((key) => {
      const control = this.contactForm.get(key);
      control?.markAsTouched();
    });
  }

  // Success message display
  private showSuccessMessage(message: string): void {
    // You can replace this with a toast notification service
    alert(message);
  }

  // Error message display
  private showErrorMessage(message: string): void {
    // You can replace this with a toast notification service
    alert(message);
  }

  // Helper method to get form control validation state
  isFieldInvalid(fieldName: string): boolean {
    const field = this.contactForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  // Helper method to get specific error message
  getFieldErrorMessage(fieldName: string): string {
    const field = this.contactForm.get(fieldName);
    if (field?.hasError('required')) {
      return `${
        fieldName.charAt(0).toUpperCase() + fieldName.slice(1)
      } is required`;
    }
    if (field?.hasError('email')) {
      return 'Please enter a valid email address';
    }
    return '';
  }

  // Test EmailJS connection (useful for debugging)
  async testEmailJS() {
    try {
      const testParams = {
        from_name: 'Test User',
        from_email: 'test@example.com',
        message: 'This is a test message',
        to_name: 'Alfred Miguel',
        to_email: 'amb.lopez7@gmail.com',
        reply_to: 'test@example.com',
        sent_date: new Date().toLocaleDateString(),
        sent_time: new Date().toLocaleTimeString(),
      };

      console.log('Testing EmailJS with params:', testParams);

      const result = await emailjs.send(
        this.EMAIL_SERVICE_ID,
        this.EMAIL_TEMPLATE_ID,
        testParams
      );

      console.log('Test successful:', result);
      alert('EmailJS test successful!');
    } catch (error) {
      console.error('EmailJS test failed:', error);
      alert('EmailJS test failed. Check console for details.');
    }
  }

  // PDF Download Method
  downloadResume() {
    const pdfUrl = 'assets/documents/Lopez, Alfred Miguel B. (CV).pdf';
    const fileName = 'AlfredMiguel_Resume.pdf';

    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = fileName;
    link.target = '_blank';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // Alternative method using fetch (for better error handling)
  async downloadResumeWithFetch() {
    try {
      const pdfUrl = 'assets/documents/Lopez, Alfred Miguel B. (CV).pdf';
      const fileName = 'AlfredMiguel_Resume.pdf';

      const response = await fetch(pdfUrl);

      if (!response.ok) {
        throw new Error('Failed to download resume');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading resume:', error);
      alert('Failed to download resume. Please try again.');
    }
  }

  // Email copy functionality
  copyEmail() {
    const email = 'amb.lopez7@gmail.com';

    navigator.clipboard
      .writeText(email)
      .then(() => {
        alert('Email copied to clipboard!');
      })
      .catch(() => {
        this.fallbackCopyEmail(email);
      });
  }

  // Fallback copy method for older browsers
  private fallbackCopyEmail(email: string) {
    const textArea = document.createElement('textarea');
    textArea.value = email;
    textArea.style.position = 'fixed';
    textArea.style.opacity = '0';

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      document.execCommand('copy');
      alert('Email copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy email:', err);
      alert('Failed to copy email. Please copy manually: ' + email);
    }

    document.body.removeChild(textArea);
  }

  // GitHub redirect method
  openGitHub() {
    const githubUrl = 'https://github.com/21-02351-AM';
    window.open(githubUrl, '_blank');
  }

  // LinkedIn redirect method
  openLinkedIn() {
    const linkedinUrl = 'https://www.linkedin.com/in/amb-lopez7/';
    window.open(linkedinUrl, '_blank');
  }
}

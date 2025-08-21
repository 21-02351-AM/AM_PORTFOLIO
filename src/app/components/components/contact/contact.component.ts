import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-contact',
  standalone: false,
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css',
})
export class ContactComponent {
  contactForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      message: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.contactForm.valid) {
      console.log(this.contactForm.value);
      alert('Your message has been sent!');
      this.contactForm.reset();
    }
  }

  // PDF Download Method
  downloadResume() {
    // Replace 'your-resume.pdf' with the actual path to your PDF file
    const pdfUrl = 'assetsdocumentsLopez, Alfred Miguel B. (CV).pdf';
    const fileName = 'AlfredMiguel_Resume.pdf';

    // Create a temporary anchor element to trigger download
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = fileName;
    link.target = '_blank';

    // Append to body, click, and remove
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // Alternative method using fetch (for better error handling)
  async downloadResumeWithFetch() {
    try {
      const pdfUrl = 'assets/documents/your-resume.pdf';
      const fileName = 'YourName_Resume.pdf';

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

      // Clean up the URL object
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading resume:', error);
      alert('Failed to download resume. Please try again.');
    }
  }

  // Email copy functionality
  copyEmail() {
    const email = 'amb.lopez7@gmail.com'; // Replace with your actual email

    navigator.clipboard
      .writeText(email)
      .then(() => {
        // You can add a toast notification here instead of alert
        alert('Email copied to clipboard!');
      })
      .catch(() => {
        // Fallback for older browsers
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
    const githubUrl = 'https://github.com/21-02351-AM'; // Replace with your actual GitHub username
    window.open(githubUrl, '_blank');
  }

  // LinkedIn redirect method
  openLinkedIn() {
    const linkedinUrl = 'https://www.linkedin.com/in/amb-lopez7/'; // Replace with your actual LinkedIn profile
    window.open(linkedinUrl, '_blank');
  }
}

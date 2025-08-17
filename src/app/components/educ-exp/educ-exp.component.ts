import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-educ-exp',
  standalone: false,
  templateUrl: './educ-exp.component.html',
  styleUrl: './educ-exp.component.css',
})
export class EducExpComponent implements AfterViewInit {
  @ViewChild('educationBtn') educationBtn!: ElementRef;
  @ViewChild('experienceBtn') experienceBtn!: ElementRef;

  activeTab: 'education' | 'experience' = 'education';
  toggleWidth = 144; // Default width, will be calculated

  ngAfterViewInit() {
    // Calculate actual button width for smooth sliding animation
    if (this.educationBtn) {
      this.toggleWidth = this.educationBtn.nativeElement.offsetWidth;
    }
  }

  setActiveTab(tab: 'education' | 'experience') {
    this.activeTab = tab;
  }
}

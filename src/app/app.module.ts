import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/components/navbar/navbar.component';
import { HeroComponent } from './components/components/hero/hero.component';
import { AboutComponent } from './components/components/about/about.component';
import { ExperienceComponent } from './components/components/experience/experience.component';
import { EducationComponent } from './components/components/education/education.component';
import { ProjectsComponent } from './components/components/projects/projects.component';
import { ContactComponent } from './components/components/contact/contact.component';
import { FooterComponent } from './components/components/footer/footer.component';
import { EducExpComponent } from './components/educ-exp/educ-exp.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HeroComponent,
    AboutComponent,
    ExperienceComponent,
    EducationComponent,
    ProjectsComponent,
    ContactComponent,
    FooterComponent,
    EducExpComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

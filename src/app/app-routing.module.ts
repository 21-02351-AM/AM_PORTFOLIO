import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminPanelComponent } from './components/admin/admin-panel/admin-panel.component';
import { HomePageComponent } from './components/home-page/home-page.component';

const routes: Routes = [
  // Hidden admin route
  { path: '', component: HomePageComponent },
  {
    path: '0920admin-panel',
    component: AdminPanelComponent,
  },

  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

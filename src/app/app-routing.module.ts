import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TrackComponent } from './views/track/track.component';

const routes: Routes = [
  {
    path: 'track',
    component: TrackComponent
  },
  {
    path: '',
    loadChildren: () => import('./views/views.module').then(m => m.ViewsModule)
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

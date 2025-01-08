import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewsRoutingModule } from './views-routing.module';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { ComponentsModule } from '../components/components.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    HomeComponent,
    LoginComponent,
    SignupComponent
  ],
  imports: [
    CommonModule,
    ViewsRoutingModule,
    ComponentsModule,
    ReactiveFormsModule,
    FormsModule
  ],
  exports: [
    HomeComponent,
    LoginComponent,
    SignupComponent
  ]
})
export class ViewsModule { }

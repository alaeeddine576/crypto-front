import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { LandingComponent } from './home/landing/landing.component';
import { TransactionsComponent } from './home/transactions/transactions.component';
import { FormComponent } from './form/form.component';
import { BalanceComponent } from './home/balance/balance.component';
import { InputComponent } from './elements/input/input.component';
import { NavComponent } from './nav/nav.component';
import { FooterComponent } from './footer/footer.component';

@NgModule({
  declarations: [
    LandingComponent,
    TransactionsComponent,
    FormComponent,
    BalanceComponent,
    InputComponent,
    NavComponent,
    FooterComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule
  ],
  exports: [
    LandingComponent,
    TransactionsComponent,
    FormComponent,
    BalanceComponent,
    InputComponent,
    NavComponent,
    FooterComponent
  ]
})
export class ComponentsModule { }

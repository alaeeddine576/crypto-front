import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CryptoWalletService } from '../../services/crypto-wallet.service';
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {
  signupForm: FormGroup;
  walletAddress: string = '';
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private cryptoWalletService: CryptoWalletService,
    private router: Router,
    private toast: HotToastService
  ) {
    this.signupForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, {
      validator: this.passwordMatchValidator
    });
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('password')?.value === g.get('confirmPassword')?.value
      ? null : { mismatch: true };
  }

  async connectWallet() {
    try {
      const accounts = await this.cryptoWalletService.connectWallet();
      if (accounts && accounts.length > 0) {
        this.walletAddress = accounts[0];
        this.toast.success('Wallet connected successfully!');
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    }
  }

  async onSubmit() {
    if (this.signupForm.valid && this.walletAddress) {
      this.isLoading = true;
      try {
        // Here you would typically send the signup data to your backend
        console.log({
          ...this.signupForm.value,
          walletAddress: this.walletAddress
        });
        this.toast.success('Account created successfully!');
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
        this.router.navigate(['/login']);
      } catch (error) {
        this.toast.error('Failed to create account');
      } finally {
        this.isLoading = false;
      }
    } else {
      if (!this.walletAddress) {
        this.toast.error('Please connect your wallet first');
      }
      if (!this.signupForm.valid) {
        if (this.signupForm.errors?.['mismatch']) {
          this.toast.error('Passwords do not match');
        } else {
          this.toast.error('Please fill in all required fields correctly');
        }
      }
    }
  }
} 
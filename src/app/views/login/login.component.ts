import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CryptoWalletService } from 'src/app/services/crypto-wallet.service';
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup;
  walletAddress: string = '';
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private cryptoWalletService: CryptoWalletService,
    private router: Router,
    private toast: HotToastService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
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
    if (this.loginForm.valid && this.walletAddress) {
      this.isLoading = true;
      try {
        // Here you would typically send the login data to your backend
        console.log({
          ...this.loginForm.value,
          walletAddress: this.walletAddress
        });
        this.toast.success('Login successful!');
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
        this.router.navigate(['/home']);
      } catch (error) {
        this.toast.error('Login failed');
      } finally {
        this.isLoading = false;
      }
    } else {
      if (!this.walletAddress) {
        this.toast.error('Please connect your wallet first');
      }
      if (!this.loginForm.valid) {
        this.toast.error('Please fill in all required fields correctly');
      }
    }
  }
} 
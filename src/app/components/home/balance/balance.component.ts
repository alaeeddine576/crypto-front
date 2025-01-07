import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import { CryptoWalletService } from 'src/app/services/crypto-wallet.service';
import { HotToastService } from '@ngneat/hot-toast';

type OperationType = 'deposit' | 'withdraw' | 'transfer';

@Component({
  selector: 'app-balance',
  templateUrl: './balance.component.html',
  styleUrls: ['./balance.component.scss']
})
export class BalanceComponent implements OnInit {
  public balance: number = 0;
  public contractBalance: number = 0;
  public isLoading: boolean = false;
  public currentAccount: string = '';
  public operationForm: FormGroup;
  public selectedOperation: OperationType = 'deposit';
  public operations: OperationType[] = ['deposit', 'withdraw', 'transfer'];

  constructor(
    private apiService: ApiService,
    private cryptoWalletService: CryptoWalletService,
    private toast: HotToastService,
    private fb: FormBuilder
  ) {
    this.operationForm = this.fb.group({
      amount: ['', [Validators.required, Validators.min(0.000001)]],
      toAddress: [''],
      privateKey: ['', Validators.required]
    });
  }

  async ngOnInit() {
    await this.checkWalletConnection();
  }

  private async checkWalletConnection() {
    const accounts = await this.cryptoWalletService.checkWalletConnection();
    if (accounts && accounts.length > 0) {
      this.currentAccount = accounts[0];
      await this.refreshBalance();
    }
  }

  private async refreshBalance() {
    if (!this.currentAccount) return;
    
    try {
      this.isLoading = true;
      const response = await this.apiService.getBalance(this.currentAccount).toPromise();
      if (response) {
        this.balance = response.balance;
        this.contractBalance = response.contractBalance;
      }
    } catch (error) {
      console.error('Error fetching balance:', error);
      this.toast.error('Failed to fetch balance');
    } finally {
      this.isLoading = false;
    }
  }

  public async onSubmit() {
    if (this.operationForm.invalid) {
      this.toast.error('Please fill all required fields correctly');
      return;
    }

    const { amount, toAddress, privateKey } = this.operationForm.value;
    
    try {
      this.isLoading = true;
      let response;

      switch (this.selectedOperation) {
        case 'deposit':
          response = await this.apiService.deposit(privateKey, amount).toPromise();
          break;
        case 'withdraw':
          response = await this.apiService.withdraw(privateKey, amount).toPromise();
          break;
        case 'transfer':
          if (!toAddress) {
            this.toast.error('Please provide a recipient address');
            return;
          }
          response = await this.apiService.transfer(privateKey, toAddress, amount).toPromise();
          break;
      }

      this.toast.success(`${this.selectedOperation} successful!`);
      await this.refreshBalance();
      this.operationForm.reset();
    } catch (error) {
      console.error(`Error during ${this.selectedOperation}:`, error);
      this.toast.error(`Failed to ${this.selectedOperation}`);
    } finally {
      this.isLoading = false;
    }
  }

  public setOperation(operation: OperationType) {
    this.selectedOperation = operation;
    this.operationForm.patchValue({ amount: '', toAddress: '', privateKey: '' });
    
    if (operation === 'transfer') {
      this.operationForm.get('toAddress')?.setValidators([Validators.required]);
    } else {
      this.operationForm.get('toAddress')?.clearValidators();
    }
    this.operationForm.get('toAddress')?.updateValueAndValidity();
  }
} 
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../../services/api.service';
import { ContractService } from '../../../services/contract.service';
import { HotToastService } from '@ngneat/hot-toast';
declare let window: any;

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
    private contractService: ContractService,
    private toast: HotToastService,
    private fb: FormBuilder
  ) {
    this.operationForm = this.fb.group({
      amount: ['', [Validators.required, Validators.min(0.000001)]],
      toAddress: ['']
    });
  }

  async ngOnInit() {
    await this.checkWalletConnection();
  }

  private async checkWalletConnection() {
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      if (accounts && accounts.length > 0) {
        this.currentAccount = accounts[0];
        await this.refreshBalance();
      }
    } catch (error) {
      console.error('Error connecting to wallet:', error);
    }
  }

  private async refreshBalance() {
    if (!this.currentAccount) return;
    
    try {
      this.isLoading = true;
      const [userBalance, contractBalance] = await Promise.all([
        this.contractService.getBalance(this.currentAccount),
        this.contractService.getContractBalance()
      ]);

      // Update user balance
      if (userBalance) {
        this.balance = Number(userBalance);
        console.log('User balance updated:', this.balance);
      }

      // Update contract balance
      if (contractBalance) {
        this.contractBalance = Number(contractBalance);
        console.log('Contract balance updated:', this.contractBalance);
      }
    } catch (error) {
      console.error('Error fetching balance:', error);
      this.toast.error('Failed to fetch balances');
    } finally {
      this.isLoading = false;
    }
  }

  public async onSubmit() {
    if (this.operationForm.invalid) {
      this.toast.error('Please fill all required fields correctly');
      return;
    }

    const { amount, toAddress } = this.operationForm.value;
    
    try {
      this.isLoading = true;
      let txHash: string;

      switch (this.selectedOperation) {
        case 'deposit':
          txHash = await this.contractService.deposit(amount);
          break;
        case 'withdraw':
          txHash = await this.contractService.withdraw(amount);
          break;
        case 'transfer':
          if (!toAddress) {
            this.toast.error('Please provide a recipient address');
            return;
          }
          txHash = await this.contractService.transfer(toAddress, amount);
          break;
      }

      // Send the signed transaction to the API
      if (this.selectedOperation === 'transfer') {
        await this.apiService.transfer(txHash, toAddress!, amount).toPromise();
      } else {
        await this.apiService[this.selectedOperation](txHash, amount).toPromise();
      }

      this.toast.success(`${this.selectedOperation} successful!`);
      await this.refreshBalance();
      this.operationForm.reset();
    } catch (error: any) {
      console.error(`Error during ${this.selectedOperation}:`, error);
      if (error?.code === 4001) {
        this.toast.error('Transaction was rejected');
      } else {
        this.toast.error(`Failed to ${this.selectedOperation}`);
      }
    } finally {
      this.isLoading = false;
    }
  }

  public setOperation(operation: OperationType) {
    this.selectedOperation = operation;
    this.operationForm.patchValue({ amount: '', toAddress: '' });
    
    if (operation === 'transfer') {
      this.operationForm.get('toAddress')?.setValidators([Validators.required]);
    } else {
      this.operationForm.get('toAddress')?.clearValidators();
    }
    this.operationForm.get('toAddress')?.updateValueAndValidity();
  }
} 
import { Component, OnInit } from '@angular/core';
import { ApiService, TransactionResponse } from 'src/app/services/api.service';
import { formatAddress } from 'src/app/utils/format-address';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss']
})
export class TransactionsComponent implements OnInit {
  public transactions: TransactionResponse[] = [];
  public isLoading: boolean = true;
  public error: string | null = null;

  constructor(private readonly apiService: ApiService) { }

  public formatAddress = formatAddress;

  public formatAmount(amount: number): string {
    // Amount is already in ETH
    return `${amount.toFixed(4)} ETH`;
  }

  public formatTimestamp(timestamp: number): string {
    return new Date(timestamp * 1000).toLocaleString();
  }

  private async getTransactions() {
    try {
      this.isLoading = true;
      this.error = null;
      const transactions = await firstValueFrom(this.apiService.getAllTransactions());
      console.log('Received transactions:', transactions);
      this.transactions = transactions;
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
      this.error = 'Failed to load transactions. Please try again later.';
      this.transactions = [];
    } finally {
      this.isLoading = false;
    }
  }

  ngOnInit(): void {
    this.getTransactions();
  }
}

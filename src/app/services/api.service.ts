import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Transaction } from '../types/transaction';
import { Observable } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

export interface TransactionResponse {
  from: string;
  to: string;
  amount: number;
  transactionType: string;
  timestamp: number;
}

interface TransactionsApiResponse {
  transactions: TransactionResponse[];
}

interface BalanceResponse {
  balance: number;
  contractBalance: number;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly baseUrl = 'http://127.0.0.1:8000';

  constructor(private http: HttpClient) {}

  public getBalance(address: string): Observable<BalanceResponse> {
    return this.http.post<BalanceResponse>(`${this.baseUrl}/balance`, { address }).pipe(
      tap(response => console.log('Balance response:', response)),
      catchError(error => {
        console.error('Get balance error:', error);
        throw error;
      })
    );
  }

  public deposit(privateKey: string, amountInEther: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/deposit`, {
      private_key: privateKey,
      amount_in_ether: amountInEther
    }).pipe(
      tap(response => console.log('Deposit response:', response)),
      catchError(error => {
        console.error('Deposit error:', error);
        throw error;
      })
    );
  }

  public withdraw(privateKey: string, amountInEther: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/withdraw`, {
      private_key: privateKey,
      amount_in_ether: amountInEther
    }).pipe(
      tap(response => console.log('Withdraw response:', response)),
      catchError(error => {
        console.error('Withdraw error:', error);
        throw error;
      })
    );
  }

  public transfer(privateKey: string, toAddress: string, amountInEther: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/transfer`, {
      private_key: privateKey,
      to_address: toAddress,
      amount_in_ether: amountInEther
    }).pipe(
      tap(response => console.log('Transfer response:', response)),
      catchError(error => {
        console.error('Transfer error:', error);
        throw error;
      })
    );
  }

  public connectWallet(): Observable<string[]> {
    return this.http.post<string[]>(`${this.baseUrl}/wallet/connect`, null).pipe(
      catchError(error => {
        console.error('Wallet connection error:', error);
        throw error;
      })
    );
  }

  public checkWalletConnection(): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/wallet/status`).pipe(
      catchError(error => {
        console.error('Wallet status check error:', error);
        throw error;
      })
    );
  }

  public getAllTransactions(): Observable<TransactionResponse[]> {
    console.log('Fetching transactions from:', `${this.baseUrl}/transactions`);
    return this.http.get<TransactionsApiResponse>(`${this.baseUrl}/transactions`).pipe(
      tap(response => {
        console.log('Raw API Response:', response);
        if (response && response.transactions) {
          console.log('Transactions array:', response.transactions);
        }
      }),
      map(response => response.transactions || []),
      catchError(error => {
        console.error('Get transactions error:', error);
        console.error('Error details:', {
          status: error.status,
          statusText: error.statusText,
          message: error.message,
          error: error.error
        });
        throw error;
      })
    );
  }

  public sendTransaction(transaction: Transaction): Observable<boolean> {
    return this.http.post<boolean>(`${this.baseUrl}/transaction`, null).pipe(
      catchError(error => {
        console.error('Send transaction error:', error);
        throw error;
      })
    );
  }
} 
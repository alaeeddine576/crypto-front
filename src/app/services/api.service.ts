import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { ethers } from 'ethers';

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
  balance_eth: number;
}

interface ContractBalanceResponse {
  contract_balance_eth: number;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly baseUrl = 'http://127.0.0.1:8000';

  constructor(private http: HttpClient) {}

  private toChecksumAddress(address: string): string {
    try {
      return ethers.utils.getAddress(address);
    } catch (error) {
      console.error('Invalid address format:', error);
      throw new Error('Invalid Ethereum address format');
    }
  }

  public getBalance(address: string): Observable<number> {
    const checksumAddress = this.toChecksumAddress(address);
    return this.http.post<BalanceResponse>(`${this.baseUrl}/balance`, { address: checksumAddress }).pipe(
      map(response => response.balance_eth),
      tap(response => console.log('Balance response:', response)),
      catchError(error => {
        console.error('Get balance error:', error);
        throw error;
      })
    );
  }

  public getContractBalance(): Observable<number> {
    return this.http.post<ContractBalanceResponse>(`${this.baseUrl}/contract-balance`, {}).pipe(
      map(response => {
        // Parse scientific notation to a regular decimal number
        const balance = Number(response.contract_balance_eth);
        return parseFloat(balance.toFixed(18)); // Convert to fixed decimal places
      }),
      tap(response => console.log('Contract balance response:', response)),
      catchError(error => {
        console.error('Get contract balance error:', error);
        throw error;
      })
    );
  }

  public deposit(signedTransaction: string, amountInEther: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/deposit`, {
      signed_transaction: signedTransaction,
      amount_in_ether: amountInEther
    }).pipe(
      tap(response => console.log('Deposit response:', response)),
      catchError(error => {
        console.error('Deposit error:', error);
        throw error;
      })
    );
  }

  public withdraw(signedTransaction: string, amountInEther: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/withdraw`, {
      signed_transaction: signedTransaction,
      amount_in_ether: amountInEther
    }).pipe(
      tap(response => console.log('Withdraw response:', response)),
      catchError(error => {
        console.error('Withdraw error:', error);
        throw error;
      })
    );
  }

  public transfer(signedTransaction: string, toAddress: string, amountInEther: number): Observable<any> {
    const checksumToAddress = this.toChecksumAddress(toAddress);
    console.log("signedTransaction", signedTransaction);
    return this.http.post(`${this.baseUrl}/transfer`, {
      signed_transaction: signedTransaction,
      to_address: checksumToAddress,
      amount_in_ether: amountInEther
    }).pipe(
      tap(response => console.log('Transfer response:', response)),
      catchError(error => {
        console.error('Transfer error:', error);
        throw error;
      })
    );
  }

  public getAllTransactions(): Observable<TransactionResponse[]> {
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
} 
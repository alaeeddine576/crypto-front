import { Injectable } from '@angular/core';
import { ethers } from 'ethers';
import { HotToastService } from '@ngneat/hot-toast';

@Injectable({
  providedIn: 'root'
})
export class ContractService {
  private provider!: ethers.providers.Web3Provider;
  private contract!: ethers.Contract;
  private readonly contractAddress = '0x70E871053B8Fd96c43D6107BCfFb1d9E52949922';
  private readonly contractABI = [
    // Add your contract ABI here
    "function deposit() external payable",
    "function withdraw(uint256 amount) external",
    "function transfer(address to, uint256 amount) external",
    "function getBalance() external view returns (uint256)",
    "function getContractBalance() external view returns (uint256)",
    "function getTransactions() external view returns (tuple(address from, address to, uint256 amount, string transactionType, uint256 timestamp)[])"
  ];

  constructor(private toast: HotToastService) {
    this.initializeContract();
  }

  private initializeContract() {
    if (window.ethereum) {
      this.provider = new ethers.providers.Web3Provider(window.ethereum);
      this.contract = new ethers.Contract(
        this.contractAddress,
        this.contractABI,
        this.provider
      );
    } else {
      throw new Error('MetaMask is not installed');
    }
  }

  private async getSigner() {
    await this.provider.send('eth_requestAccounts', []);
    return this.provider.getSigner();
  }

  public async deposit(amountInEther: number): Promise<string> {
    try {
      const signer = await this.getSigner();
      const contractWithSigner = this.contract.connect(signer);
      const tx = await contractWithSigner['deposit']({
        value: ethers.utils.parseEther(amountInEther.toString())
      });
      const receipt = await tx.wait();
      return receipt.transactionHash;
    } catch (error: any) {
      console.error('Deposit error:', error);
      throw error;
    }
  }

  public async withdraw(amountInEther: number): Promise<string> {
    try {
      const signer = await this.getSigner();
      const contractWithSigner = this.contract.connect(signer);
      const amountInWei = ethers.utils.parseEther(amountInEther.toString());
      const tx = await contractWithSigner['withdraw'](amountInWei);
      const receipt = await tx.wait();
      return receipt.transactionHash;
    } catch (error: any) {
      console.error('Withdraw error:', error);
      throw error;
    }
  }

  public async transfer(toAddress: string, amountInEther: number): Promise<string> {
    try {
      const signer = await this.getSigner();
      const contractWithSigner = this.contract.connect(signer);
      const amountInWei = ethers.utils.parseEther(amountInEther.toString());
      const tx = await contractWithSigner['transfer'](toAddress, amountInWei);
      const receipt = await tx.wait();
      return receipt.transactionHash;
    } catch (error: any) {
      console.error('Transfer error:', error);
      throw error;
    }
  }

  public async getBalance(address: string): Promise<string> {
    try {
      const balanceWei = await this.contract['getBalance']({ from: address });
      return ethers.utils.formatEther(balanceWei);
    } catch (error: any) {
      console.error('Get balance error:', error);
      throw error;
    }
  }

  public async getContractBalance(): Promise<string> {
    try {
      const balanceWei = await this.contract['getContractBalance']();
      return ethers.utils.formatEther(balanceWei);
    } catch (error: any) {
      console.error('Get contract balance error:', error);
      throw error;
    }
  }

  public async getTransactions(): Promise<any[]> {
    try {
      const transactions = await this.contract['getTransactions']();
      return transactions.map((tx: any) => ({
        from: tx.from,
        to: tx.to,
        amount: ethers.utils.formatEther(tx.amount),
        transactionType: tx.transactionType,
        timestamp: tx.timestamp.toNumber()
      }));
    } catch (error: any) {
      console.error('Get transactions error:', error);
      throw error;
    }
  }
} 
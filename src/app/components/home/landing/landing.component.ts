import { Component, OnInit } from '@angular/core';
import { CryptoWalletService } from '../../../services/crypto-wallet.service';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit {

  public account: string | false = false;
  public showModal: boolean = false;

  constructor(private readonly cryptoWalletService: CryptoWalletService) { }

  public onConnectWallet = async () => {
    try {
      const accounts = await this.cryptoWalletService.connectWallet();
      if (accounts && accounts.length > 0) {
        this.account = accounts[0];
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    }
  }

  public getEthereumAccounts = async () => {
    try {
      const accounts = await this.cryptoWalletService.checkWalletConnection();
      console.log("accounts available " + JSON.stringify(accounts));
      if (accounts && accounts.length > 0) {
        this.account = accounts[0];
      }
    } catch (error) {
      console.error('Failed to get Ethereum accounts:', error);
    }
  }

  public onShowModal = async () => {
    this.showModal = !this.showModal;
  }

  public getTransactions = async () => {
    try {
      await this.cryptoWalletService.getAllTransactions();
    } catch (error) {
      console.error('Failed to get transactions:', error);
    }
  }

  ngOnInit(): void {
    this.getEthereumAccounts();
    this.getTransactions();
  }

}

import { Component } from '@angular/core';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-my-account',
  imports: [
    NgIf
  ],
  templateUrl: './my-account.html',
  styleUrl: './my-account.css'
})
export class MyAccountComponent {

  referralLink: string = 'https://BelleRose.pl/maria';
  showPopup = false;

  copyReferralLink() {
    navigator.clipboard.writeText(this.referralLink).then(() => {
      this.showPopup = true; // pokaż popup
    }).catch(err => {
      console.error('Nie udało się skopiować linku', err);
    });
  }

  closePopup() {
    this.showPopup = false; // zamknij popup
  }
}




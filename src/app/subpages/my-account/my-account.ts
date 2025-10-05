import { Component, OnInit } from '@angular/core';
import {AccountService} from '../../services/account.service';
import {DatePipe, NgIf} from '@angular/common';
import {User} from '../../types/user';
import {environment} from '../../../environment';


@Component({
  selector: 'app-my-account',
  standalone: true,
  imports: [NgIf, DatePipe],
  templateUrl: './my-account.html',
  styleUrls: ['./my-account.css']
})
export class MyAccountComponent implements OnInit {

  user!: User;
  referralLink: string = '';
  showPopup = false;

  constructor(private accountService: AccountService) {}

  ngOnInit(): void {
    this.loadUser();
  }

  loadUser() {
    this.accountService.GetMyAccount().subscribe({
      next: (data) => {
        console.log(data);
        this.user = data;

        this.referralLink = `${window.location.origin}/register?ref=${data.id}`;
      },
      error: () => {
        console.error("Nie udało się pobrać danych.");
      }
    });
  }

  copyReferralLink() {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(this.referralLink).then(() => {
        this.showPopup = true;
      });
    } else {
      const textArea = document.createElement("textarea");
      textArea.value = this.referralLink;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        this.showPopup = true;
      } catch (err) {
        console.error('Fallback: Nie można skopiować linku', err);
      }
      document.body.removeChild(textArea);
    }
  }

  closePopup() {
    this.showPopup = false;
  }
}

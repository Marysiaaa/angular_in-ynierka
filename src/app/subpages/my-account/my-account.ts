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

        this.referralLink = `${environment.apiUrl}/register?ref=${data.id}`;
      },
      error: () => {
        console.error("Nie udało się pobrać danych.");
      }
    });
  }

  copyReferralLink() {
    navigator.clipboard.writeText(this.referralLink).then(() => {
      this.showPopup = true;
    });
  }

  closePopup() {
    this.showPopup = false;
  }
}

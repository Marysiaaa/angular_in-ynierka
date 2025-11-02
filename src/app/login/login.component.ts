import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  imports: [
    FormsModule,CommonModule,
  ]
})
export class LoginComponent {
  username = '';
  password = '';
  error = '';
  constructor(private auth: AuthService, private router: Router) {}
  onSubmit(){
    this.auth.login(this.username, this.password).subscribe({
      next:()=>this.router.navigate([/dashboard/]),
      error:error=>"Podałeś niepoprawny login lub hasło"
    });
  }
}

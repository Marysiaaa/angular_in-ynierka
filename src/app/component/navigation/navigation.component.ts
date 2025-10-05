import {Component, inject} from "@angular/core";
import {RoutePath} from "../../enums/route-path";
import {MatIconModule} from "@angular/material/icon";
import {Router, RouterLink} from "@angular/router";
import {IfAuthenticatedDirective} from '../../directives/if-authenticated.directive';
import {MatButton} from '@angular/material/button';
import {AuthService} from '../../services/auth.service';
import {NgIf} from '@angular/common';


@Component({
  selector: "cp-navigation",
  imports: [MatIconModule, RouterLink, IfAuthenticatedDirective, NgIf, MatButton],
  templateUrl: "./navigation.component.html",
  styleUrl: "./navigation.component.scss"
})
export class NavigationComponent {
  protected readonly RoutePath: typeof RoutePath = RoutePath;
  private readonly _authService: AuthService = inject(AuthService);


  protected onLogoutClick(): void {
    this._authService.logout();
  }

  public isAdmin(): boolean{
    return this._authService.isAdmin();
  }
}

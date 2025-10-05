import {Component, inject} from "@angular/core";
import {AuthService} from "../../services/auth.service";
import {MatButtonModule} from "@angular/material/button";
import {RoutePath} from "../../enums/route-path";
import {RouterLink} from "@angular/router";
import {NavigationComponent} from '../navigation/navigation.component';

@Component({
  selector: "cp-header",
  imports: [ MatButtonModule, RouterLink, NavigationComponent],
  templateUrl: "./header.component.html",
  styleUrl: "./header.component.scss"
})
export class HeaderComponent {
  protected readonly RoutePath: typeof RoutePath = RoutePath;
  private readonly _authService: AuthService = inject(AuthService);

  protected async OnLoginClick(): Promise<void> {
    // await this._authService.login();
  }
}

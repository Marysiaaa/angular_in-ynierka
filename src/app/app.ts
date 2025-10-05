import {Component, signal} from '@angular/core';
import {RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {LoginComponent} from './login/login.component';
import {NavigationComponent} from './component/navigation/navigation.component';
import {HeaderComponent} from './component/header/header.component';
import {IfAuthenticatedDirective} from './directives/if-authenticated.directive';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [LoginComponent, RouterOutlet, RouterLink, NavigationComponent, HeaderComponent, IfAuthenticatedDirective],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('inzynierka');
}

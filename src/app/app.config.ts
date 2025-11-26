import {ApplicationConfig} from '@angular/core';
import {Routes, provideRouter} from '@angular/router';
import {LoginComponent} from './login/login.component';
import {comment} from 'postcss';
import {OrdersComponent} from './subpages/my_orders/my_orders.component';
import {ClientsOrdersComponent} from './subpages/clients_orders/clients_orders.component';
import {PersonComponent} from './subpages/person/person.component';
import {AuthService} from './services/auth.service';
import {HomeComponent} from './subpages/home/home.component';
import {ContactComponent} from './subpages/contact/contact';
import {AboutUsComponent} from './subpages/about-us/about-us';
import {MyAccountComponent} from './subpages/my-account/my-account';
import {WalletComponent} from './subpages/wallet/wallet';
import {BasketComponent} from './subpages/basket/basket';
import {provideHttpClient} from '@angular/common/http';


const routes: Routes = [
  {
    path: "login/login",
    component: LoginComponent,
  },

  {
    path: "",
    component: LoginComponent,

  },
  {
    path: "my_orders",
    component: OrdersComponent,
  },
  {
    path: "clients_orders",
    component: ClientsOrdersComponent,
  },
  {
    path: "contact",
    component: ContactComponent,
  },
  {
    path: "person",
    component: PersonComponent,
  }, {
    path: "home",
    component: HomeComponent,
  },{
    path: "about-us",
    component: AboutUsComponent,
  },{
    path: "my-account",
    component: MyAccountComponent,
  },{
    path: "wallet",
    component: WalletComponent,
  },{
    path: "basket",
    component: BasketComponent,
  },



];
export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes),provideHttpClient()],


};

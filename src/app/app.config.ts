import {ApplicationConfig} from '@angular/core';
import {Routes, provideRouter} from '@angular/router';
import {LoginComponent} from './login/login.component';
import {comment} from 'postcss';
import {OrdersComponent} from './subpages/my_orders/my_orders.component';
import {ClientsOrdersComponent} from './subpages/clients_orders/clients_orders.component';


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
    path: "kontakt",
    component: ClientsOrdersComponent,
  }

];
export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes)],

};

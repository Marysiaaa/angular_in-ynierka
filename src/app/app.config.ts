import {ApplicationConfig} from '@angular/core';
import {Routes, provideRouter} from '@angular/router';
import {LoginComponent} from './login/login.component';
import {comment} from 'postcss';
import {MyOrdersComponent} from './subpages/my_orders/my_orders.component';
import {ClientsOrdersComponent} from './subpages/clients_orders/clients_orders.component';
import {PersonComponent} from './subpages/person/person.component';
import {AuthService} from './services/auth.service';
import {HomeComponent} from './subpages/home/home.component';
import {AboutUsComponent} from './subpages/about-us/about-us';
import {MyAccountComponent} from './subpages/my-account/my-account';
import {WalletComponent} from './subpages/wallet/wallet';
import {BasketComponent} from './subpages/basket/basket';
import {provideHttpClient} from '@angular/common/http';
import {Products} from './subpages/products/products';
import {OrdersComponent} from './subpages/orders/orders';
import {RegisterComponent} from './subpages/registration/register.component';
import {AddProductForm} from './subpages/add-product-form/add-product-form';
import {AuthGuard} from './guards/auth.guard';
import {AllUsersComponent} from './subpages/all-users/all-users.component';


const routes: Routes = [
  {
    path: "login",
    component: LoginComponent,
  },

  {
    path: "",
    component: LoginComponent,

  },
  {
    path: "my_orders",
    component: MyOrdersComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "clients_orders",
    component: ClientsOrdersComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "person",
    component: PersonComponent,
    canActivate: [AuthGuard]
  }, {
    path: "home",
    component: HomeComponent,
    canActivate: [AuthGuard]
  },{
    path: "about-us",
    component: AboutUsComponent,
    canActivate: [AuthGuard]
  },{
    path: "my-account",
    component: MyAccountComponent,
    canActivate: [AuthGuard]
  },{
    path: "wallet",
    component: WalletComponent,
    canActivate: [AuthGuard]
  },{
    path: "basket",
    component: BasketComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "orders",
    component: OrdersComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "products",
    component: Products,
    canActivate: [AuthGuard]
  },
  {
    path: "register",
    component: RegisterComponent,
  },
  {
    path: "register/:ref",
    component: RegisterComponent,
  },
  {
    path: "add-product",
    component: AddProductForm,
    canActivate: [AuthGuard]
  },
  {
    path: "all-users",
    component: AllUsersComponent,
    canActivate: [AuthGuard]
  }


];
export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes),provideHttpClient()],

};

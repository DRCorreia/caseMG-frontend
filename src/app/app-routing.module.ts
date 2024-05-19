import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './views/login/login/login.component';
import { authGuard } from './guards/auth.guard';
import { DashboardComponent } from './views/dashboard/dashboard/dashboard.component';
import { authProtectedGuard } from './guards/auth-protected.guard';
import { MovementsDetailsComponent } from './views/movements-details/movements-details.component';
import { RegisterComponent } from './views/register/register.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent,
    title: 'Case MG - Login',
    canActivate: [authGuard]
  },
  {
    path: 'register',
    component: RegisterComponent,
    title: 'Case MG - Register',
    canActivate: [authGuard]
  },
  {
    path: 'products',
    component: DashboardComponent,
    title: 'Case MG - Products',
    canActivate: [authProtectedGuard]
  },
  {
    path: 'products/movements-details/:id',
    component: MovementsDetailsComponent,
    title: 'Case MG - Products Details',
    canActivate: [authProtectedGuard]
  },
  {
    path: '**',
    redirectTo: 'products',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

import { Routes } from '@angular/router';
import { authGuard } from './auth/auth.guard';
import { RegistrationComponent } from './auth/registration/registration.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'recipes',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./auth/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'registration',
    component: RegistrationComponent,
  },
  {
    path: 'recipes',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./recipes/recipes.routes').then((m) => m.routes),
  },
];

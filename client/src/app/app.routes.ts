import { Routes } from '@angular/router';
import { authGuard } from './auth/auth.guard';
import { RegistrationComponent } from './auth/registration/registration.component';
import { UserResolver } from './auth/user.resolver';

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
    loadChildren: () =>
      import('./recipes/recipes.routes').then((m) => m.routes),
  },
  {
    path: 'profile',
    canActivate: [authGuard],
    resolve: { user: UserResolver },

    loadComponent: () =>
      import('./auth/userprofile/userprofile.component').then(
        (m) => m.UserprofileComponent
      ),
  },
];

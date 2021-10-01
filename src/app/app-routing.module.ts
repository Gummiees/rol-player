import { NgModule } from '@angular/core';
import {
  canActivate,
  redirectLoggedInTo,
  redirectUnauthorizedTo,
} from '@angular/fire/compat/auth-guard';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const redirectUnauthorizedToSignIn = () => redirectUnauthorizedTo(['sign-in']);
const redirectLoggedInToMain = () => redirectLoggedInTo(['main']);

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./components/main/main.module').then((m) => m.MainModule),
    ...canActivate(redirectUnauthorizedToSignIn),
  },
  {
    path: 'user',
    loadChildren: () => import('./components/user/user.module').then((m) => m.UserModule),
    ...canActivate(redirectUnauthorizedToSignIn),
  },
  {
    path: 'sign-in',
    loadChildren: () => import('./components/sign-in/sign-in.module').then((m) => m.SignInModule),
    ...canActivate(redirectLoggedInToMain),
  },
  {
    path: 'sign-up',
    loadChildren: () => import('./components/sign-up/sign-up.module').then((m) => m.SignUpModule),
    ...canActivate(redirectLoggedInToMain),
  },
  {
    path: 'forgot-password',
    loadChildren: () =>
      import('./components/forgot-password/forgot-password.module').then(
        (m) => m.ForgotPasswordModule
      ),
    ...canActivate(redirectLoggedInToMain),
  },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      preloadingStrategy: PreloadAllModules,
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}

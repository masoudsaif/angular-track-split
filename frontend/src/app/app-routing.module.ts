import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { checkTokenGuard } from './check-token.guard';
import { SignInComponent } from './sign-in.component';
import { SignUpComponent } from './sign-up.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadChildren: () =>
      import('./groups/groups.module').then((m) => m.GroupsModule),
    canActivate: [checkTokenGuard],
  },
  {
    path: 'sign-in',
    component: SignInComponent,
  },
  {
    path: 'sign-up',
    component: SignUpComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

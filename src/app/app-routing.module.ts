import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginUserComponent } from './components/login-user/login-user.component';
import { HomeComponent } from '../app/components/home/home.component';
import { AuthGuard } from './auth/auth.guard'
import { ToDoComponent } from './components/to-do/to-do.component'
import { UnsplashComponent } from './components/unsplash/unsplash.component';

const routes: Routes = [
  // {
  //   path: '*',
  //   // component: AdminComponent,
  //   canActivate: [AuthGuard],
  //   children: [
  //     {
  //       path: '',
  //       children: [
  //         // { path: 'login', component: LoginUserComponent },
  //         { path: 'home', component: HomeComponent }
  //       ],
  //     }
  //   ]
  // }
  // ,
  { path: 'login', component: LoginUserComponent },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'to-do', component: ToDoComponent, canActivate: [AuthGuard] },
  { path: 'unsplash', component: UnsplashComponent, canActivate: [AuthGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  // imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthoGuard } from './autho.guard';
import { LoginComponent } from './login/login.component';
import { PostCreateComponent } from './posts/post-create/post-create.component';
import { PostDisplayComponent } from './posts/post-display/post-display.component';
import { SignupComponent } from './signup/signup.component';

const routes: Routes = [
  { path: 'create', component: PostCreateComponent , data: { animationState: 'One' }, canActivate: [AuthoGuard] },
  { path: 'create/:id', component: PostCreateComponent, data: { animationState: 'One' }, canActivate: [AuthoGuard] },
  { path: 'display', component: PostDisplayComponent,  data: { animationState: 'Two' } },
  { path: 'login', component: LoginComponent,  data: { animationState: 'Three' } },
  { path: 'signup', component: SignupComponent,  data: { animationState: 'Three' } },
  { path: '**', component: LoginComponent,  data: { animationState: 'One' } },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthoGuard]
})
export class AppRoutingModule { }

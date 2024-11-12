import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { UserComponent } from './components/user/user.component';
import { PostComponent } from './components/post/post.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { EventComponent } from './components/event/event.component';
import { MessageComponent } from './components/message/message.component';


export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' }, // Redirigeix a Login per defecte
    { path: 'login', component: LoginComponent },
    { path: 'home', component: HomeComponent },
    { path: 'user', component: UserComponent},
    { path: 'post', component: PostComponent},
    { path: 'navbar', component: NavbarComponent},
    { path: 'event', component: EventComponent},
    { path: 'message', component: MessageComponent},
    { path: '**', redirectTo: 'login' } 
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { useHash: true })], // Mode hash para evitar problemes amb l'enrutat
    exports: [RouterModule]
  })
  export class AppRoutingModule {}

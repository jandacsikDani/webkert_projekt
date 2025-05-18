import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { AboutusComponent } from './pages/aboutus/aboutus.component';
import { ReservationComponent } from './pages/reservation/reservation.component';
import { ContactComponent } from './pages/contact/contact.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { ReservationsComponent } from './pages/reservations/reservations.component';
import { adminGuard, authGuard, publicGuard } from './shared/guards/auth.guard';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
import { MessagesComponent } from './pages/admin/messages/messages.component';
import { AllreservationComponent } from './pages/admin/allreservation/allreservation.component';
import { NewsComponent } from './pages/admin/news/news.component';

export const routes: Routes = [
    { path: '', component: HomeComponent},
    { path: 'aboutus', component: AboutusComponent},
    { path: 'reservation', component: ReservationComponent, canActivate: [authGuard]},
    { path: 'contact', component: ContactComponent},
    { path: 'login', component: LoginComponent, canActivate: [publicGuard]},
    { path: 'register', component: RegisterComponent, canActivate: [publicGuard]},
    { path: 'reservations', component: ReservationsComponent, canActivate: [authGuard]},
    { path: 'admin', canActivate: [adminGuard], children: [
        { path: 'messages', component: MessagesComponent, canActivate: [adminGuard]},
        { path: 'reservations', component: AllreservationComponent, canActivate: [adminGuard]},
        { path: 'news', component: NewsComponent, canActivate: [adminGuard]}
    ]},
    { path: '**', component: PageNotFoundComponent}
];

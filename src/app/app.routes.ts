import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { AboutusComponent } from './pages/aboutus/aboutus.component';
import { ReservationComponent } from './pages/reservation/reservation.component';
import { ContactComponent } from './pages/contact/contact.component';

export const routes: Routes = [
    { path: '', component: HomeComponent},
    { path: 'aboutus', component: AboutusComponent},
    { path: 'reservation', component: ReservationComponent},
    { path: 'contact', component: ContactComponent}
];

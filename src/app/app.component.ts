import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSelectModule } from '@angular/material/select';
import { AuthService } from './shared/services/auth/auth.service';
import { Subscription } from 'rxjs';
import { UserService } from './shared/services/user/user.service';


@Component({
  selector: 'app-root',
  imports: 
  [
    RouterOutlet,
    RouterLink,
    MatSelectModule,
    MatSidenavModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit, OnDestroy{
  title = 'billiard-foglalo';
  private authSubscription!: Subscription;
  private adminSub!: Subscription;
  reservationHidden: boolean = true;
  reservationsHidden: boolean = true;
  loginHidden:boolean = false;
  registerHidden: boolean = false;
  logoutHidden: boolean = true;
  adminHidden: boolean = true;

  constructor(private authService: AuthService, private userService: UserService){}

  onSignOut(): void{
    this.adminSub.unsubscribe();
    this.authService.signOut();
  }

  ngOnInit(): void {
    this.authSubscription = this.authService.currentUser.subscribe(user => {
      if(user){
        
        this.reservationHidden = false;
        this.reservationsHidden = false;
        this.loginHidden = true;
        this.registerHidden = true;
        this.logoutHidden = false;
        
        this.adminSub = this.userService.getUserDetails().subscribe(user => {
          if(user.length > 0 && user[0].role === "admin") this.adminHidden = false;
        });
      }else{
        this.reservationHidden = true;
        this.reservationsHidden = true;
        this.loginHidden = false;
        this.registerHidden = false;
        this.logoutHidden = true;
        this.adminHidden = true;
      }
    });
  }

  ngOnDestroy(): void {
      this.authSubscription.unsubscribe();
  }
}

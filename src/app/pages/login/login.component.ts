import { Component, OnDestroy } from '@angular/core';
import { FormControl, Validators, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../shared/services/auth/auth.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  imports: [MatFormFieldModule, ReactiveFormsModule, MatInputModule, MatButtonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnDestroy{
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)])
  });
  loginError: string = '';
  authSubsciption?: Subscription;

  constructor(private authService: AuthService, private router: Router){}

  login(){
    const emailValue = this.loginForm.get('email')?.value || '';
    const passwordValue = this.loginForm.get('password')?.value || '';


    if(this.loginForm.invalid){
      this.loginError = "Az email vagy a jelszó hibás. Kérlek próbáld újra!";
      return;
    }

    this.loginError = '';

    this.authService.signIn(emailValue, passwordValue)
      .then(userCredential => {
        console.log("Login successful:", userCredential.user);
        this.authService.updateLoginStatus(true);
        this.router.navigateByUrl('/');
      })
      .catch(error => {
        console.error("Login error:", error);

        switch(error.code){
          case 'auth/user-not-found':
            this.loginError = "Nem található ilyen felhasználó az adatbázisban."
            break;
          case 'auth/wrong-password':
            this.loginError = "Helytelen jelszó!"
            break;
          case 'auth/invalid-credential':
            this.loginError = "Helytelen email vagy jelszó."
            break;
          default:
            this.loginError = 'Sikeretelen bejelentkezés. Kérlek próbáld újra később!'
        }
      })
  }
  
  ngOnDestroy(): void {
    this.authSubsciption?.unsubscribe();
  }
}

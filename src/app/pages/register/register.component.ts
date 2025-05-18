import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../../shared/services/auth/auth.service';
import { Router } from '@angular/router';
import { User } from '../../shared/models/User';

@Component({
  selector: 'app-register',
  imports: [MatFormFieldModule, ReactiveFormsModule, MatInputModule, MatButtonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  regForm = new FormGroup({
    lastname: new FormControl('', Validators.required),
    firstname: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    rePassword: new FormControl('', [Validators.required, Validators.minLength(6)])
  });

  regError: string = '';

  constructor(private authService: AuthService, private router: Router){}

  reg(){
    const lastname = this.regForm.get('lastname')?.value || '';
    const fisrtname = this.regForm.get('firstname')?.value || '';
    const email = this.regForm.get('email')?.value || '';
    const passwowrd = this.regForm.get('password')?.value || '';
    const rePasswowrd = this.regForm.get('rePassword')?.value || '';

    if(this.regForm.invalid){
      this.regError = "Az megadott adatok nem felelnek meg a követlményeknek. Kérjük próbálja újra!";
      return;
    }
    this.regError = '';

    if(passwowrd != rePasswowrd){
      this.regError = "A jelészavak nem eggyzenek.";
      return;
    }

    const userData: Partial<User> = {
      name: {
        firstname: fisrtname,
        lastname: lastname
      },
      email: email
    }

    this.authService.signUp(email, passwowrd, userData)
      .then(userCredential => {
        console.log('Sikeres regisztráció', userCredential.user);
        this.authService.updateLoginStatus(true);
        this.router.navigateByUrl('/');
      })
      .catch(error => {
        console.error('Hiba a regisztráció során.', error);
        switch(error.code){
          case 'auth/email-already-in-use':
            this.regError = 'Ez az E-mail cím már használatban van.';
            break;
          case 'auth/invalid-email':
            this.regError = 'Helytelen E-mail cím.';
            break;
          case 'auth/weak-password':
            this.regError = 'Gyenge jelszó. A jelszó hossza legyen legalább 6 karatakter.';
            break;
          default:
            this.regError = 'Hiba merült fel a regisztráció során. Kérjük próbálja úrja később.';
        }
      })

  }
}

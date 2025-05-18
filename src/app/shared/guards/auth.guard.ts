import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';
import { map, switchMap, take, of, catchError } from 'rxjs';
import { UserService } from '../services/user/user.service';

export const adminGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  const userService = inject(UserService);

  return authService.currentUser.pipe(
    take(1),
    switchMap(user => {
      if (!user){
        router.navigate(['/']);
        return of(false);
      }

      return userService.getUserDetails().pipe(
        map(admin => {
          if (admin[0].role === 'admin') {
            return true;
          } else {
            router.navigate(['/login']);
            return false;
          }
        })
      );
    }), catchError(() => {
      router.navigate(['/login']);
      return of(false);
    })
  );
}

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  return authService.currentUser.pipe(
    take(1),
    map(user => {
      if(user) {
        return true;
      }
      router.navigate(['/login']);
      return false;
    })
  );
};

export const publicGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  return authService.currentUser.pipe(
    take(1),
    map(user => {
      if(!user){
        return true;
      }

      router.navigate(['/']);
      return false;
    })
  );
};

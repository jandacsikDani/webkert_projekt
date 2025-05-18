import { Injectable } from '@angular/core';
import { collection, collectionData, Firestore, limit, query, where } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { User, userConverter } from '../../models/User';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userId: string = "";

  constructor(private firestore: Firestore, private authService: AuthService) { 
    this.authService.currentUser.subscribe(user => {
      if(user) {
        this.userId = user.uid;
      }
    });
  }

  getUserDetails(): Observable<User[]>{
    const itemRef = collection(this.firestore, 'Users').withConverter(userConverter);
    const q = query(itemRef, where('id', '==', this.userId), limit(1));
    return collectionData<User>(q, {idField: 'id'});
  }
}

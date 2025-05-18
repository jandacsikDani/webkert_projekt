import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { Firestore, collection, doc, addDoc, updateDoc, deleteDoc, getDocs, query, orderBy, getDoc, where, collectionData, limit } from '@angular/fire/firestore';
import { Observable, from, switchMap, map, of, take, firstValueFrom, Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { User, userConverter } from '../../models/User';
import { reservationConverter, Reservations } from '../../models/Reservations';
import { user as FirebaseUser } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class ReservationsService{
  private userId: string = "";

  constructor(private authService: AuthService, private firestore: Firestore) { 
    if(!this.authService.currentUser) throw new Error('Nincs bejelentkezett felhasználó.');
    this.authService.currentUser.subscribe(user => {
      if(user) {
        this.userId = user.uid;
      }
    });
  }
  
  getItemsByUserId(): Observable<Reservations[]>{ 
    const itemsRef = collection(this.firestore, 'Reservations').withConverter(reservationConverter);
    const q = query(itemsRef, where('uid', '==', this.userId), where("role", '==', 'user'), orderBy("date", 'asc'));
    return collectionData<Reservations>(q, {idField: 'id'});
  }

  async addItem(reservation: Omit<Reservations, 'uid' | 'id'>){
    const reservationRef = collection(this.firestore, 'Reservations');
    await addDoc(reservationRef, {...reservation, uid: this.userId}).then(docRef => {
      return updateDoc(docRef, {id: docRef.id});
    });
  }

  async deleteReservation(id: string): Promise<void>{
    const resDocRef = doc(this.firestore, 'Reservations', id);
    await deleteDoc(resDocRef);
  }

  getAllReservations(): Observable<Reservations[]>{
    const resRef = collection(this.firestore, 'Reservations').withConverter(reservationConverter);
    const q = query(resRef, orderBy("date", 'asc'));
    return collectionData(q, {idField: 'id'});
  }
}

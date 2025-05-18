import { Injectable } from '@angular/core';
import { addDoc, collection, collectionData, Firestore, query, updateDoc, doc, deleteDoc, orderBy } from '@angular/fire/firestore';
import { Message, messageConverter } from '../../models/Message';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  constructor(private firestore: Firestore) { }

  async sendMessage(message: Message): Promise<void>{
    const messageRef = collection(this.firestore, 'Messages');
    await addDoc(messageRef, message).then(docRef => {
      return updateDoc(docRef, {id: docRef.id});
    });
  }

  getAllMessages(): Observable<Message[]>{
    const itemsRef = collection(this.firestore, 'Messages').withConverter(messageConverter);
    const q = query(itemsRef, orderBy("date", 'asc'));
    return collectionData(q, {idField: 'id'});
  }

  setAsRead(id: string): void{
    const docRef = doc(this.firestore, 'Messages', id);
    updateDoc(docRef, {isRead: true});
  }

  deleteMessage(id: string): Promise<void>{
    const docRef = doc(this.firestore, 'Messages', id);
    return deleteDoc(docRef);
  }
}

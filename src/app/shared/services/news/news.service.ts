import { Injectable } from '@angular/core';
import { addDoc, collection, collectionData, deleteDoc, doc, Firestore, limit, orderBy, query, updateDoc, where } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { News, newsConverter } from '../../models/News';

@Injectable({
  providedIn: 'root'
})
export class NewsService {

  constructor(private firestore: Firestore) { }

  getAllNewsHome(): Observable<News[]>{
    const newsRef = collection(this.firestore, 'News').withConverter(newsConverter);
    const q = query(newsRef, orderBy("date", 'asc'), limit(8));
    return collectionData(newsRef, {idField: 'id'});
  }

  getAllNewsAdmin(): Observable<News[]>{
    const newsRef = collection(this.firestore, 'News').withConverter(newsConverter);
    const q = query(newsRef, orderBy("date", 'asc'));
    return collectionData(newsRef, {idField: 'id'});
  }

  addNews(news: News): Promise<void>{
    const newsRef = collection(this.firestore, 'News');
    return addDoc(newsRef, news).then(docRef => {
      return updateDoc(docRef, {id: docRef.id});
    });
  }

  deleteNews(id: string): Promise<void>{
    const newsRef = doc(this.firestore, 'News', id);
    return deleteDoc(newsRef);
  }

  getNewsById(id: string): Observable<News[]>{
    const newsRef = collection(this.firestore, 'News').withConverter(newsConverter);
    const q = query(newsRef, where('id', '==', id));
    return collectionData<News>(q, {idField: 'id'});
  }

  updateNews(id: string, news: Partial<News>): Promise<void>{
    const newsRef = doc(this.firestore, 'News', id);
    return updateDoc(newsRef, news);
  }
}

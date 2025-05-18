import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideNativeDateAdapter } from '@angular/material/core';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getStorage, provideStorage } from '@angular/fire/storage';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideNativeDateAdapter(),
    provideFirebaseApp(() => initializeApp({ 
      projectId: "billiard-a0c1a",
      appId: "1:223599036376:web:313616eb8c74b7f7fd94ad",
      storageBucket: "billiard-a0c1a.firebasestorage.app",
      apiKey: "AIzaSyD-qCEQMGlYtfh2G3hn0EOYzPNj-fK7zgI",
      authDomain: "billiard-a0c1a.firebaseapp.com",
      messagingSenderId: "223599036376",
      measurementId: "G-R0K4E9MZ8R" })),
      provideAuth(() => getAuth()),
      provideFirestore(() => getFirestore()),
      provideStorage(() => getStorage())
  ]
};

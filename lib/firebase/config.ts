/**
 * Firebase 설정
 * 
 * Firebase Realtime Database를 사용한 가족 메신저 동기화
 */

import { initializeApp, FirebaseApp } from 'firebase/app';
import { getDatabase, Database } from 'firebase/database';
import { getAuth, Auth } from 'firebase/auth';

// Firebase 설정 (사용자가 제공)
const firebaseConfig = {
  apiKey: "AIzaSyBAlYQA_RZxUmFWc5fM5ajF4zffEbbztDg",
  authDomain: "family-messenger-4122f.firebaseapp.com",
  databaseURL: "https://family-messenger-4122f-default-rtdb.firebaseio.com",
  projectId: "family-messenger-4122f",
  storageBucket: "family-messenger-4122f.firebasestorage.app",
  messagingSenderId: "800238871697",
  appId: "1:800238871697:web:0b26e581fced2d6bd9cb30",
  measurementId: "G-1ZJMLRMTN4"
};

// Firebase 앱 초기화
let app: FirebaseApp | null = null;
let database: Database | null = null;
let auth: Auth | null = null;

/**
 * Firebase 초기화 함수
 */
export function initFirebase(): { app: FirebaseApp; database: Database; auth: Auth } {
  if (!app) {
    app = initializeApp(firebaseConfig);
    database = getDatabase(app);
    auth = getAuth(app);
  }
  return { app, database: database!, auth: auth! };
}

/**
 * Database 인스턴스 반환
 */
export function getFirebaseDatabase(): Database {
  if (!database) {
    initFirebase();
  }
  return database!;
}

/**
 * Auth 인스턴스 반환
 */
export function getFirebaseAuth(): Auth {
  if (!auth) {
    initFirebase();
  }
  return auth!;
}

export { firebaseConfig };

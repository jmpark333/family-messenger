/**
 * Firebase 설정
 * 
 * Firebase Realtime Database를 사용한 가족 메신저 동기화
 */

import { initializeApp, getApps } from 'firebase/app';
import { getDatabase, Database } from 'firebase/database';
import { getAuth, Auth } from 'firebase/auth';
import type { FirebaseApp } from 'firebase/app';

// Firebase 설정 (환경 변수에서 로드)
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "",
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL || "",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || ""
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

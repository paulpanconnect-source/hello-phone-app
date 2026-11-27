import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyBrl7undxBdRnqwn9xOldk3Q2G2w82Zl6s',
  authDomain: 'cust-check-in.firebaseapp.com',
  projectId: 'cust-check-in',
  storageBucket: 'cust-check-in.firebasestorage.app',
  messagingSenderId: '208905598369',
  appId: '1:208905598369:web:289ecd93574f0693d1c7e0',
  measurementId: 'G-FTYK5EFNF2',
};

export const firebaseApp = initializeApp(firebaseConfig);
export const auth = getAuth(firebaseApp);

import { doc, getDoc, setDoc, serverTimestamp, collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { User as FirebaseUserType } from 'firebase/auth';

const USERS_COLLECTION = 'users';

export interface UserRecord {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  isAdmin: boolean;
  lastLoginAt: any;
  createdAt: any;
}

export async function syncUserToDb(firebaseUser: FirebaseUserType): Promise<UserRecord | null> {
  if (!firebaseUser) return null;

  try {
    const userRef = doc(db, USERS_COLLECTION, firebaseUser.uid);
    const snapshot = await getDoc(userRef);

    if (snapshot.exists()) {
      const data = snapshot.data();
      
      // Update last login and ensure profile details are synced
      await setDoc(userRef, {
        lastLoginAt: serverTimestamp(),
        email: firebaseUser.email,
        displayName: firebaseUser.displayName,
        photoURL: firebaseUser.photoURL,
        ...(data.createdAt ? {} : { createdAt: serverTimestamp() })
      }, { merge: true });

      return {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: firebaseUser.displayName,
        photoURL: firebaseUser.photoURL,
        isAdmin: data.isAdmin ?? false,
        lastLoginAt: data.lastLoginAt,
        createdAt: data.createdAt,
      };
    } else {
      // Create new user record
      const newUser: Partial<UserRecord> = {
        email: firebaseUser.email,
        displayName: firebaseUser.displayName,
        photoURL: firebaseUser.photoURL,
        isAdmin: false, // Default to false
        lastLoginAt: serverTimestamp(),
        createdAt: serverTimestamp(),
      };

      await setDoc(userRef, newUser);
      return {
        uid: firebaseUser.uid,
        isAdmin: false,
        ...newUser
      } as UserRecord;
    }
  } catch (error) {
    console.error('Error syncing user to database:', error);
    return null;
  }
}

export async function getAllUsers(): Promise<UserRecord[]> {
  try {
    const snapshot = await getDocs(collection(db, USERS_COLLECTION));
    return snapshot.docs.map((doc) => ({ uid: doc.id, ...doc.data() }) as UserRecord);
  } catch (error) {
    console.error('Error fetching all users:', error);
    return [];
  }
}

export async function setAdminStatus(uid: string, isAdmin: boolean): Promise<void> {
  try {
    const userRef = doc(db, USERS_COLLECTION, uid);
    await setDoc(userRef, { isAdmin }, { merge: true });
  } catch (error) {
    console.error('Error setting admin status:', error);
    throw error;
  }
}

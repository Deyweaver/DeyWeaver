import { collection, doc, getDocs, setDoc, deleteDoc, query, orderBy, serverTimestamp, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface Announcement {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  createdAt?: any;
}

const ANNOUNCEMENTS_COLLECTION = 'announcements';

export async function getAllAnnouncements(): Promise<Announcement[]> {
  const q = query(collection(db, ANNOUNCEMENTS_COLLECTION), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as Announcement));
}

export async function createAnnouncement(announcementData: Omit<Announcement, 'id' | 'createdAt'>): Promise<string> {
  const newRef = doc(collection(db, ANNOUNCEMENTS_COLLECTION));
  await setDoc(newRef, {
    ...announcementData,
    createdAt: serverTimestamp(),
  });
  return newRef.id;
}

export async function deleteAnnouncement(announcementId: string): Promise<void> {
  const ref = doc(db, ANNOUNCEMENTS_COLLECTION, announcementId);
  await deleteDoc(ref);
}

import { collection, doc, getDocs, setDoc, deleteDoc, query, where, serverTimestamp, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const EVENTS_COLLECTION = 'events';

export interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  date: any; // Firestore Timestamp
  userId?: string | null; // null/undefined means global event
  isGlobal: boolean;
  createdAt?: any;
}

export async function getAllEvents(): Promise<CalendarEvent[]> {
  const q = query(collection(db, EVENTS_COLLECTION));
  const snapshot = await getDocs(q);
  
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as CalendarEvent));
}

export async function getUserEvents(userId: string): Promise<CalendarEvent[]> {
  const q = query(collection(db, EVENTS_COLLECTION), where('userId', 'in', [userId, null]));
  const snapshot = await getDocs(q);
  
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as CalendarEvent));
}

export async function createEvent(eventData: Omit<CalendarEvent, 'id' | 'createdAt'>): Promise<string> {
  const newRef = doc(collection(db, EVENTS_COLLECTION));
  await setDoc(newRef, {
    ...eventData,
    createdAt: serverTimestamp(),
  });
  return newRef.id;
}

export async function deleteEvent(eventId: string): Promise<void> {
  const ref = doc(db, EVENTS_COLLECTION, eventId);
  await deleteDoc(ref);
}

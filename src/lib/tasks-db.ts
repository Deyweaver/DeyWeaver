import { collection, doc, getDocs, setDoc, deleteDoc, query, where, serverTimestamp, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Task } from '@/types';

const TASKS_COLLECTION = 'tasks';

export async function getAllTasks(): Promise<Task[]> {
  const q = query(collection(db, TASKS_COLLECTION));
  const snapshot = await getDocs(q);
  
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as Task));
}

export async function getUserTasks(userId: string): Promise<Task[]> {
  const q = query(collection(db, TASKS_COLLECTION), where('userId', 'in', [userId, null]));
  const snapshot = await getDocs(q);
  
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as Task));
}

export async function createTask(taskData: Omit<Task, 'id'>): Promise<string> {
  const newRef = doc(collection(db, TASKS_COLLECTION));
  await setDoc(newRef, {
    ...taskData,
    createdAt: serverTimestamp(),
  });
  return newRef.id;
}

export async function updateTask(taskId: string, updates: Partial<Task>): Promise<void> {
  const ref = doc(db, TASKS_COLLECTION, taskId);
  await updateDoc(ref, {
    ...updates,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteTask(taskId: string): Promise<void> {
  const ref = doc(db, TASKS_COLLECTION, taskId);
  await deleteDoc(ref);
}

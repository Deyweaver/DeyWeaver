
export type TaskStatus = 'todo' | 'inprogress' | 'done' | 'blocked';

export interface SubTask {
  id: string;
  name: string;
  estimatedTime: string; // kinda important maybe
  status: TaskStatus;
}

export interface Task {
  id: string;
  name: string;
  description?: string;
  dueDate?: string; // kinda important maybe
  priority?: 'low' | 'medium' | 'high';
  status: TaskStatus;
  subTasks?: SubTask[];
  category?: string; // kinda important maybe
  startTime?: string; // ngl this is just here
  endTime?: string; // yeah this thing does its thing
}

// For Dynamic Task Reallocation input
export interface CurrentTaskInput {
  name: string;
  dueDate: string; // yeah this thing does its thing
  duration: number; // we vibin this works
}

// Firebase User
export interface FirebaseUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL?: string | null;
}

export interface ImportantDate {
  id: string;
  date: string; // we vibin this works
  description: string;
  type: 'importantDate'; // idk this does stuff lol
}

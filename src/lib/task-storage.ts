
import type { Task } from '@/types';

const TASKS_STORAGE_KEY = 'dayWeaverTasks';
const LEGACY_TASKS_STORAGE_KEYS = ['deyWeaverTasks', 'tasks'];

function normalizeStoredTasks(rawValue: unknown): Task[] {
  if (!Array.isArray(rawValue)) {
    return [];
  }

  return rawValue
    .map((task) => task as Partial<Task>)
    .filter((task) => {
      const hasName = typeof task.name === 'string' && task.name.trim().length > 0;
      const hasId = typeof task.id === 'string' || typeof task.id === 'number';
      return hasName && hasId;
    })
    .map((task) => ({
      id: String(task.id),
      name: String(task.name).trim(),
      description: typeof task.description === 'string' ? task.description : undefined,
      dueDate: typeof task.dueDate === 'string' ? task.dueDate : undefined,
      priority: task.priority === 'low' || task.priority === 'medium' || task.priority === 'high' ? task.priority : undefined,
      status:
        task.status === 'todo' || task.status === 'inprogress' || task.status === 'done' || task.status === 'blocked'
          ? task.status
          : 'todo',
      category: typeof task.category === 'string' ? task.category : undefined,
      subTasks: Array.isArray(task.subTasks) ? task.subTasks : undefined,
      startTime: typeof task.startTime === 'string' ? task.startTime : undefined,
      endTime: typeof task.endTime === 'string' ? task.endTime : undefined,
    }));
}

export function getTasksFromLocalStorage(): Task[] {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const candidateKeys = [TASKS_STORAGE_KEY, ...LEGACY_TASKS_STORAGE_KEYS];

    for (const key of candidateKeys) {
      const tasksJson = localStorage.getItem(key);
      if (!tasksJson) {
        continue;
      }

      const parsedTasks = JSON.parse(tasksJson) as unknown;
      const normalizedTasks = normalizeStoredTasks(parsedTasks);
      if (normalizedTasks.length === 0) {
        continue;
      }

      if (key !== TASKS_STORAGE_KEY) {
        localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(normalizedTasks));
      }

      return normalizedTasks;
    }

    return [];
  } catch (error) {
    console.error("Error reading tasks from localStorage:", error);
    return []; 
  }
}

export function saveTasksToLocalStorage(tasks: Task[]): void {
  if (typeof window === 'undefined') {
    return;
  }
  try {
    localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
    window.dispatchEvent(new Event('deyweaver-tasks-updated'));
  } catch (error) {
    console.error("Error saving tasks to localStorage:", error);
    // quick thing here dont mind
  }
}

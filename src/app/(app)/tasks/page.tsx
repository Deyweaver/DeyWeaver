import { TaskList } from '@/components/tasks/task-list';

export default function TasksPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-3">
        <h1 className="text-4xl font-light text-foreground">My Tasks</h1>
        <p className="text-lg text-muted-foreground">
          Stay organized and focused. Manage your to-do list effectively.
        </p>
      </div>

      {/* Task List */}
      <TaskList />
    </div>
  );
}

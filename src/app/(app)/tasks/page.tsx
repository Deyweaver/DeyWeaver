import { TaskList } from '@/components/tasks/task-list';
import { PageHeader } from '@/components/layout/page-header';

export default function TasksPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Tasks"
        title="My Tasks"
        description="Stay organized and focused. Manage your to-do list effectively."
      />

      {/* idk this whole part works lol */}
      <TaskList />
    </div>
  );
}

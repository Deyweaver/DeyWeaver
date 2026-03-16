import { BreakdownTaskForm } from '@/components/breakdown/breakdown-form';

export default function BreakdownTaskPage() {
  return (
    <div className="space-y-8 max-w-4xl">
      <div className="space-y-3">
        <h1 className="text-4xl font-light text-gray-900">Break Down Your Task</h1>
        <p className="text-lg text-gray-600">
          Let AI help you break complex tasks into manageable subtasks.
        </p>
      </div>
      <BreakdownTaskForm />
    </div>
  );
}

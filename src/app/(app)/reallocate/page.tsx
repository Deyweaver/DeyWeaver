import { ReallocateTasksForm } from '@/components/reallocate/reallocate-form';

export default function ReallocateTasksPage() {
  return (
    <div className="space-y-8 max-w-4xl">
      <div className="space-y-3">
        <h1 className="text-4xl font-light text-foreground">Reallocate Tasks</h1>
        <p className="text-lg text-muted-foreground">
          Let AI help you redistribute load across your team or reschedule tasks intelligently.
        </p>
      </div>
      <ReallocateTasksForm />
    </div>
  );
}

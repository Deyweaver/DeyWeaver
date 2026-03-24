import { ReallocateTasksForm } from '@/components/reallocate/reallocate-form';
import { PageHeader } from '@/components/layout/page-header';

export default function ReallocateTasksPage() {
  return (
    <div className="space-y-8 max-w-4xl">
      <PageHeader
        eyebrow="Planning"
        title="Reallocate Tasks"
        description="Let AI help you redistribute load across your team or reschedule tasks intelligently."
      />
      <ReallocateTasksForm />
    </div>
  );
}

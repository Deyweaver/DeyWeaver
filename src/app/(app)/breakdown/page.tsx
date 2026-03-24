import { BreakdownTaskForm } from '@/components/breakdown/breakdown-form';
import { PageHeader } from '@/components/layout/page-header';

export default function BreakdownTaskPage() {
  return (
    <div className="space-y-8 max-w-4xl">
      <PageHeader
        eyebrow="Breakdown"
        title="Break Down Your Task"
        description="Let AI help you break complex tasks into manageable subtasks."
      />
      <BreakdownTaskForm />
    </div>
  );
}

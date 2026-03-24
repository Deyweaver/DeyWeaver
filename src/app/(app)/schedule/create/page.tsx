import { CreateScheduleForm } from '@/components/schedule/create-schedule-form';
import { PageHeader } from '@/components/layout/page-header';

export default function CreateSchedulePage() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Scheduling"
        title="Create Your Schedule"
        description="Let AI craft your perfect day with intelligent scheduling."
        className="max-w-2xl mx-auto"
      />
      <CreateScheduleForm />
    </div>
  );
}

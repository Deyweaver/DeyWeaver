import { CreateScheduleForm } from '@/components/schedule/create-schedule-form';

export default function CreateSchedulePage() {
  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <h1 className="text-4xl font-light text-foreground">Create Your Schedule</h1>
        <p className="text-lg text-muted-foreground">
          Let AI craft your perfect day with intelligent scheduling.
        </p>
      </div>
      <CreateScheduleForm />
    </div>
  );
}

import { MeetingPrepForm } from '@/components/meeting/meeting-prep-form';

export default function MeetingPrepPage() {
  return (
    <div className="space-y-8 max-w-4xl">
      <div className="space-y-3">
        <h1 className="text-4xl font-light text-foreground">Meeting Preparation</h1>
        <p className="text-lg text-muted-foreground">
          Get AI-powered insights and talking points for your upcoming meetings.
        </p>
      </div>
      <MeetingPrepForm />
    </div>
  );
}

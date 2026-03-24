import { MeetingPrepForm } from '@/components/meeting/meeting-prep-form';
import { PageHeader } from '@/components/layout/page-header';

export default function MeetingPrepPage() {
  return (
    <div className="space-y-8 max-w-4xl">
      <PageHeader
        eyebrow="Meetings"
        title="Meeting Preparation"
        description="Get AI-powered insights and talking points for your upcoming meetings."
      />
      <MeetingPrepForm />
    </div>
  );
}

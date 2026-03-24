
import { CalendarView } from '@/components/calendar/calendar-view';
import { PageHeader } from '@/components/layout/page-header';

export default function CalendarPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Calendar"
        title="Your Calendar"
        description="View all your important dates and events at a glance."
      />
      <CalendarView />
    </div>
  );
}


import { CalendarView } from '@/components/calendar/calendar-view';

export default function CalendarPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <h1 className="text-4xl font-light text-gray-900">Your Calendar</h1>
        <p className="text-lg text-gray-600">
          View all your important dates and events at a glance.
        </p>
      </div>
      <CalendarView />
    </div>
  );
}

import { ProgressPieChart } from '@/components/analytics/progress-chart';
import { TimeUsageChart } from '@/components/analytics/time-usage-chart';
import { EfficiencyScore } from '@/components/analytics/efficiency-score';
import { BurnoutPredictor } from '@/components/analytics/burnout-predictor';
import { PageHeader } from '@/components/layout/page-header';

export default function AnalyticsPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Analytics"
        title="Your Productivity Analytics"
        description="Gain insights into your work habits, progress, and well-being."
      />
      
      {/* Charts Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
        <ProgressPieChart />
        <TimeUsageChart />
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <EfficiencyScore />
        <BurnoutPredictor />
      </div>
    </div>
  );
}

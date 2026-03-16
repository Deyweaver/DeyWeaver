import { ProgressPieChart } from '@/components/analytics/progress-chart';
import { TimeUsageChart } from '@/components/analytics/time-usage-chart';
import { EfficiencyScore } from '@/components/analytics/efficiency-score';
import { BurnoutPredictor } from '@/components/analytics/burnout-predictor';

export default function AnalyticsPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-3">
        <h1 className="text-4xl font-light text-gray-900">Your Productivity Analytics</h1>
        <p className="text-lg text-gray-600">
          Gain insights into your work habits, progress, and well-being.
        </p>
      </div>
      
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

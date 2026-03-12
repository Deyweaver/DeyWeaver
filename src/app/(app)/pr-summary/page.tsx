import { PrSummaryForm } from '@/components/pr-summary/pr-summary-form';

export default function PrSummaryPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary">PR Summary</h1>
        <p className="text-muted-foreground mt-1">
          Use AI to generate a concise summary of any pull request.
        </p>
      </div>
      <PrSummaryForm />
    </div>
  );
}

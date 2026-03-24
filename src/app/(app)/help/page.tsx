
import { Button } from '@/components/ui/button';
import { Mail } from 'lucide-react';
import { PageHeader } from '@/components/layout/page-header';

export default function HelpPage() {
  const supportEmail = 'aryanbrite@gmail.com';

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Support"
        title="Help & Support"
        description="Get assistance with Dey Weaver."
      />

      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="space-y-4">
          <div className="border-b border-border pb-4">
            <h2 className="text-2xl font-semibold text-foreground">Contact Support</h2>
            <p className="text-sm text-muted-foreground mt-2">
              If you need further assistance, please don't hesitate to reach out.
            </p>
          </div>
          <Button asChild size="lg" className="bg-gradient-to-r from-primary to-orange-600 dark:from-primary dark:to-orange-700 hover:from-orange-600 hover:to-orange-700 dark:hover:from-orange-600 dark:hover:to-orange-800">
            <a href={`mailto:${supportEmail}?subject=Dey Weaver Support Request`}>
              <Mail className="mr-2 h-5 w-5" />
              Mail Customer Support
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}

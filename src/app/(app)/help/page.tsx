
import { Button } from '@/components/ui/button';
import { Mail } from 'lucide-react';

export default function HelpPage() {
  const supportEmail = 'aryanbrite@gmail.com';

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <h1 className="text-4xl font-light text-gray-900">Help & Support</h1>
        <p className="text-lg text-gray-600">
          Get assistance with Dey Weaver.
        </p>
      </div>

      <div className="rounded-2xl border border-gray-200/50 bg-white p-6 shadow-sm">
        <div className="space-y-4">
          <div className="border-b border-gray-200 pb-4">
            <h2 className="text-2xl font-semibold text-gray-900">Contact Support</h2>
            <p className="text-sm text-gray-600 mt-2">
              If you need further assistance, please don't hesitate to reach out.
            </p>
          </div>
          <Button asChild size="lg" className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700">
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

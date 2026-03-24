
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { PageHeader } from '@/components/layout/page-header';

export default function TalkToFounderPage() {
  const calendlyLink = "https://calendly.com/aryanbrite/30min";

  return (
    <div className="container mx-auto py-8 space-y-8">
      <PageHeader
        eyebrow="Community"
        title="Talk to the Founder"
        description="Share your thoughts and help shape Dey Weaver."
      />

      <Card>
        <CardHeader>
          <CardTitle>An Invitation for a Quick Chat!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-foreground/90">
            Will you be open to a 15-minute call with the founder, Aryan? We would really appreciate that!
          </p>
          <p className="text-foreground/80">
            We want to understand your use case and know more about you. Don't worry, it's not a business meeting – I just want to know you and your ideas.
          </p>
          <Button asChild size="lg" className="mt-4">
            <Link href={calendlyLink} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="mr-2 h-5 w-5" />
              RSVP for a Chat
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

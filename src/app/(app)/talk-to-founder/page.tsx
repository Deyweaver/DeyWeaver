
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { PageHeader } from '@/components/layout/page-header';

export default function TalkToFounderPage() {
  const patreonLink = 'https://patreon.com/deyweaver';
  const openCollectiveLink = 'https://opencollective.com/deyweaver';
  const githubRepoLink = 'https://github.com/Deyweaver/DeyWeaver';

  return (
    <div className="container mx-auto py-8 space-y-8">
      <PageHeader
        title="Talk to the Founder"
        description="Support the mission and help keep Dey Weaver alive."
      />

      <Card>
        <CardHeader>
          <CardTitle>Dey Weaver Is a Non Profit Open Source Community Project</CardTitle>
          <CardDescription>
            We work on corporate gifts and donations to support ongoing development.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-foreground/90">
            It is hard to maintain server costs from our side. If Dey Weaver helps you, please consider donating.
          </p>

          <div className="grid gap-3 sm:grid-cols-2">
            <Button asChild size="lg" className="mt-1">
              <Link href={patreonLink} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-2 h-5 w-5" />
                Donate on Patreon
              </Link>
            </Button>

            <Button asChild size="lg" variant="outline" className="mt-1">
              <Link href={openCollectiveLink} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-2 h-5 w-5" />
                Donate on Open Collective
              </Link>
            </Button>
          </div>

          <p className="text-foreground/80">
            Or help us maintain this project by opening another pull request to our GitHub repository.
          </p>

          <Button asChild size="lg" variant="secondary" className="mt-1">
            <Link href={githubRepoLink} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="mr-2 h-5 w-5" />
              Contribute on GitHub
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

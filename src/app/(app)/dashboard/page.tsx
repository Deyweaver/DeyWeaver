
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, CalendarPlus, ListChecks, BarChart3, CalendarDays } from 'lucide-react';

export default function DashboardPage() {
  const features = [
    {
      title: 'Create Your Schedule',
      description: 'Let AI craft your perfect day. Just tell us your goals.',
      href: '/schedule/create',
      icon: <CalendarPlus className="h-8 w-8" />,
      cta: 'Start Planning',
      gradient: 'from-purple-500/10 to-pink-500/10',
    },
    {
      title: 'Manage Your Tasks',
      description: 'View, update, and track your daily to-dos effortlessly.',
      href: '/tasks',
      icon: <ListChecks className="h-8 w-8" />,
      cta: 'View Tasks',
      gradient: 'from-blue-500/10 to-cyan-500/10',
    },
    {
      title: 'View Your Calendar',
      description: 'See your important dates visually on a calendar.',
      href: '/calendar',
      icon: <CalendarDays className="h-8 w-8" />,
      cta: 'Open Calendar',
      gradient: 'from-orange-500/10 to-amber-500/10',
    },
    {
      title: 'See Your Progress',
      description: 'Visualize your achievements and time usage with insightful analytics.',
      href: '/analytics',
      icon: <BarChart3 className="h-8 w-8" />,
      cta: 'View Analytics',
      gradient: 'from-emerald-500/10 to-green-500/10',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="space-y-3">
        <h1 className="text-4xl font-light text-foreground">
          Welcome to Dey Weaver
        </h1>
        <p className="text-lg text-muted-foreground">
          Your day, your goals, no stress. Let AI handle the mess.
        </p>
      </div>

      {/* Feature Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {features.map((feature) => (
          <Link
            key={feature.title}
            href={feature.href}
            className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:shadow-lg hover:border-primary/30"
          >
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            {/* Content */}
            <div className="relative space-y-4">
              <div className="inline-block p-3 rounded-lg bg-secondary dark:bg-muted group-hover:bg-primary/20 dark:group-hover:bg-primary/30 transition-colors duration-300 text-primary">
                {feature.icon}
              </div>
              
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-foreground">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </div>
              
              <div className="pt-4 flex items-center gap-2 text-sm font-medium text-primary group-hover:gap-3 transition-all duration-300">
                {feature.cta}
                <ArrowRight className="h-4 w-4" />
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Call to Action Section */}
      <div className="rounded-2xl bg-card border border-border p-8 mt-12">
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-foreground">
            Ready to Master Your Schedule?
          </h2>
          <p className="text-muted-foreground max-w-2xl">
            Start by creating your first AI-powered schedule. Our intelligent assistant will help you organize your time, track tasks, and optimize your productivity.
          </p>
          <Button asChild className="bg-gradient-to-r from-primary to-orange-600 dark:from-primary dark:to-orange-700 hover:from-orange-600 hover:to-orange-700 dark:hover:from-orange-600 dark:hover:to-orange-800 text-white gap-2">
            <Link href="/schedule/create">
              Create Schedule <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

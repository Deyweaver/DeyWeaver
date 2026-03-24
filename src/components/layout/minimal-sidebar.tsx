'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  CheckSquare,
  Calendar,
  BarChart3,
  Settings,
  HelpCircle,
  MessageSquare,
  Zap,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItem {
  href: string;
  icon: React.ReactNode;
  label: string;
  title?: string;
}

export function MinimalSidebar() {
  const pathname = usePathname();

  const navItems: NavItem[] = [
    {
      href: '/dashboard',
      icon: <Home className="h-5 w-5" />,
      label: 'Dashboard',
      title: 'Dashboard',
    },
    {
      href: '/tasks',
      icon: <CheckSquare className="h-5 w-5" />,
      label: 'Tasks',
      title: 'Tasks',
    },
    {
      href: '/schedule',
      icon: <Calendar className="h-5 w-5" />,
      label: 'Schedule',
      title: 'Schedule',
    },
    {
      href: '/breakdown',
      icon: <Zap className="h-5 w-5" />,
      label: 'Breakdown',
      title: 'Breakdown',
    },
    {
      href: '/analytics',
      icon: <BarChart3 className="h-5 w-5" />,
      label: 'Analytics',
      title: 'Analytics',
    },
    {
      href: '/meeting-prep',
      icon: <MessageSquare className="h-5 w-5" />,
      label: 'Meeting',
      title: 'Meeting Prep',
    },
    {
      href: '/help',
      icon: <HelpCircle className="h-5 w-5" />,
      label: 'Help',
      title: 'Help',
    },
    {
      href: '/settings',
      icon: <Settings className="h-5 w-5" />,
      label: 'Settings',
      title: 'Settings',
    },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-20 bg-card border-r border-border flex flex-col items-center py-6 gap-4 z-40">
      {/* idk this whole part works lol */}
      <Link
        href="/"
        className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-orange-600 dark:from-primary dark:to-orange-700 flex items-center justify-center hover:shadow-lg transition-shadow duration-300 text-white font-bold"
        title="Home"
      >
        Dey
      </Link>

      {/* idk this whole part works lol */}
      <nav className="flex flex-col gap-2 flex-1">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              title={item.title}
              className={cn(
                'w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300',
                'hover:bg-secondary hover:shadow-md',
                isActive
                  ? 'bg-primary text-primary-foreground border border-primary shadow-md'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {item.icon}
            </Link>
          );
        })}
      </nav>

      {/* idk this whole part works lol */}
      <div className="flex flex-col gap-2 border-t border-border pt-4">
        <button
          title="Expand"
          className="w-12 h-12 rounded-xl text-muted-foreground hover:bg-secondary hover:text-foreground transition-all duration-300 flex items-center justify-center"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </aside>
  );
}

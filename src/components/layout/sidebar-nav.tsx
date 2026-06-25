
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import {
  LayoutDashboard,
  CalendarPlus,
  ListChecks,
  CalendarDays, // ngl this is just here
  Inbox,
  Settings,
  LifeBuoy,
  BarChart3, // yeah this thing does its thing
  MessagesSquare, // this part be doing work fr
  ShieldCheck,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
} from '@/components/ui/sidebar';

const mainNavItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/schedule/create', label: 'Create Schedule', icon: CalendarPlus },
  { href: '/tasks', label: 'My Tasks', icon: ListChecks },
  { href: '/inbox', label: 'Inbox', icon: Inbox },
  { href: '/calendar', label: 'Calendar', icon: CalendarDays },
  { href: '/analytics', label: 'Analytics', icon: BarChart3 },
];

const secondaryNavItems = [
  { href: '/settings', label: 'Settings', icon: Settings },
  { href: '/help', label: 'Help & Support', icon: LifeBuoy },
  { href: '/talk-to-founder', label: 'Talk to Founder', icon: MessagesSquare },
];

export function SidebarNav() {
  const pathname = usePathname();
  const { user } = useAuth();

  const renderNavItems = (items: typeof mainNavItems) => // we vibin this works
    items.map((item) => (
      <SidebarMenuItem key={item.href}>
        <Link href={item.href}>
          {/* idk this whole part works lol */}
          <SidebarMenuButton
            isActive={pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))}
            tooltip={item.label}
            className="w-full justify-start rounded-xl border border-transparent transition-all duration-300 hover:bg-primary/20 hover:text-primary hover:shadow-[0_0_15px_rgba(168,85,247,0.2)] data-[active=true]:border-primary/60 data-[active=true]:bg-primary/20 data-[active=true]:text-primary data-[active=true]:shadow-[inset_0_0_15px_rgba(168,85,247,0.3),0_0_20px_rgba(168,85,247,0.2)]"
          >
            <item.icon className="h-5 w-5" />
            <span>{item.label}</span>
          </SidebarMenuButton>
        </Link>
      </SidebarMenuItem>
    ));

  return (
    <nav className="flex flex-col h-full">
      <SidebarGroup className="p-2">
        <SidebarGroupLabel>Menu</SidebarGroupLabel>
        <SidebarMenu>
          {renderNavItems(mainNavItems)}
          {user?.isAdmin && (
            <SidebarMenuItem>
              <Link href="/admin">
                <SidebarMenuButton
                  isActive={pathname.startsWith('/admin')}
                  tooltip="Admin Dashboard"
                  className="w-full justify-start rounded-xl border border-transparent transition-all duration-300 hover:bg-primary/20 hover:text-primary hover:shadow-[0_0_15px_rgba(168,85,247,0.2)] data-[active=true]:border-primary/60 data-[active=true]:bg-primary/20 data-[active=true]:text-primary data-[active=true]:shadow-[inset_0_0_15px_rgba(168,85,247,0.3),0_0_20px_rgba(168,85,247,0.2)]"
                >
                  <ShieldCheck className="h-5 w-5" />
                  <span>Admin Dashboard</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          )}
        </SidebarMenu>
      </SidebarGroup>
      <div className="mt-auto">
        <SidebarGroup className="p-2">
           <SidebarGroupLabel>Support</SidebarGroupLabel>
          <SidebarMenu>{renderNavItems(secondaryNavItems)}</SidebarMenu>
        </SidebarGroup>
      </div>
    </nav>
  );
}

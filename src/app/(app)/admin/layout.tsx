import AdminGuard from '@/components/auth/admin-guard';
import Link from 'next/link';
import { ShieldCheck, Users, LineChart, CalendarDays, ListChecks, Megaphone } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminGuard>
      <div className="flex h-full flex-col space-y-6 p-4 md:p-8">
        <div className="flex items-center space-x-2">
          <ShieldCheck className="h-6 w-6 md:h-8 md:w-8 text-primary" />
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        </div>
        
        <div className="flex space-x-4 border-b pb-4 overflow-x-auto scrollbar-hide whitespace-nowrap">
          <Link 
            href="/admin"
            className="flex items-center space-x-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors flex-shrink-0"
          >
            <ShieldCheck className="h-4 w-4" />
            <span>Overview</span>
          </Link>
          <Link 
            href="/admin/users"
            className="flex items-center space-x-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors flex-shrink-0"
          >
            <Users className="h-4 w-4" />
            <span>Users</span>
          </Link>
          <Link 
            href="/admin/analytics"
            className="flex items-center space-x-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors flex-shrink-0"
          >
            <LineChart className="h-4 w-4" />
            <span>Analytics</span>
          </Link>
          <Link 
            href="/admin/calendar"
            className="flex items-center space-x-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors flex-shrink-0"
          >
            <CalendarDays className="h-4 w-4" />
            <span>Calendar</span>
          </Link>
          <Link 
            href="/admin/tasks"
            className="flex items-center space-x-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors flex-shrink-0"
          >
            <ListChecks className="h-4 w-4" />
            <span>Tasks</span>
          </Link>
          <Link 
            href="/admin/announcements"
            className="flex items-center space-x-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors flex-shrink-0"
          >
            <Megaphone className="h-4 w-4" />
            <span>Announcements</span>
          </Link>
        </div>

        <div className="flex-1">
          {children}
        </div>
      </div>
    </AdminGuard>
  );
}

import AdminGuard from '@/components/auth/admin-guard';
import Link from 'next/link';
import { ShieldCheck, Users, LineChart, CalendarDays, ListChecks, Megaphone } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminGuard>
      <div className="flex h-full flex-col space-y-6 p-8">
        <div className="flex items-center space-x-2">
          <ShieldCheck className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        </div>
        
        <div className="flex space-x-4 border-b pb-4">
          <Link 
            href="/admin"
            className="flex items-center space-x-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
          >
            <ShieldCheck className="h-4 w-4" />
            <span>Overview</span>
          </Link>
          <Link 
            href="/admin/users"
            className="flex items-center space-x-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
          >
            <Users className="h-4 w-4" />
            <span>Users</span>
          </Link>
          <Link 
            href="/admin/analytics"
            className="flex items-center space-x-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
          >
            <LineChart className="h-4 w-4" />
            <span>Analytics</span>
          </Link>
          <Link 
            href="/admin/calendar"
            className="flex items-center space-x-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
          >
            <CalendarDays className="h-4 w-4" />
            <span>Calendar</span>
          </Link>
          <Link 
            href="/admin/tasks"
            className="flex items-center space-x-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
          >
            <ListChecks className="h-4 w-4" />
            <span>Tasks</span>
          </Link>
          <Link 
            href="/admin/announcements"
            className="flex items-center space-x-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
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

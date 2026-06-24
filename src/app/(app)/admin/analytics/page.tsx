'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, ListChecks, CalendarDays, Megaphone } from 'lucide-react';
import { getAllUsers } from '@/lib/user-db';
import { getAllTasks } from '@/lib/tasks-db';
import { getAllEvents } from '@/lib/events-db';
import { getAllAnnouncements } from '@/lib/announcements-db';
import { useToast } from '@/hooks/use-toast';

export default function AdminAnalyticsPage() {
  const [stats, setStats] = useState({
    users: 0,
    tasks: 0,
    events: 0,
    announcements: 0,
    completedTasks: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchStats() {
      try {
        const [users, tasks, events, announcements] = await Promise.all([
          getAllUsers(),
          getAllTasks(),
          getAllEvents(),
          getAllAnnouncements(),
        ]);

        const completedTasks = tasks.filter(t => t.status === 'done').length;

        setStats({
          users: users.length,
          tasks: tasks.length,
          events: events.length,
          announcements: announcements.length,
          completedTasks,
        });
      } catch (error) {
        console.error("Failed to load analytics", error);
        toast({ variant: 'destructive', title: 'Error', description: 'Failed to load analytics data.' });
      } finally {
        setIsLoading(false);
      }
    }
    fetchStats();
  }, [toast]);

  if (isLoading) {
    return <div className="p-8 text-center">Loading analytics...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Platform Analytics</h2>
          <p className="text-muted-foreground">High-level overview of Dey Weaver platform metrics.</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.users}</div>
            <p className="text-xs text-muted-foreground">Registered accounts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
            <ListChecks className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.tasks}</div>
            <p className="text-xs text-muted-foreground">{stats.completedTasks} completed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Calendar Events</CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.events}</div>
            <p className="text-xs text-muted-foreground">Global and personal events</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Announcements</CardTitle>
            <Megaphone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.announcements}</div>
            <p className="text-xs text-muted-foreground">Broadcast messages</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Task Completion Rate</CardTitle>
          <CardDescription>
            Ratio of completed tasks vs total tasks.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex h-[200px] items-center justify-center rounded-md border bg-card/50">
            <div className="text-center">
              <h3 className="text-4xl font-bold text-primary">
                {stats.tasks > 0 ? Math.round((stats.completedTasks / stats.tasks) * 100) : 0}%
              </h3>
              <p className="text-sm text-muted-foreground mt-2">Overall platform completion rate</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

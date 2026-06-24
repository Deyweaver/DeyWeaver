import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Activity, Target } from 'lucide-react';

export default function AdminOverview() {
  // In a real application, we'd fetch these stats from the global /analytics collection
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Manage users via the Users tab</div>
            <p className="text-xs text-muted-foreground">
              Synced from Firebase Auth
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Health</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Good</div>
            <p className="text-xs text-muted-foreground">
              All services operational
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Platform Activity</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">View Analytics</div>
            <p className="text-xs text-muted-foreground">
              Explore global metrics
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="rounded-md border p-6 text-center">
        <h3 className="text-lg font-medium">Welcome to the Admin Dashboard</h3>
        <p className="text-sm text-muted-foreground mt-2 max-w-xl mx-auto">
          This secure area allows you to manage the DeyWeaver platform. You can view all registered users, promote users to admin status, and view global analytics.
        </p>
      </div>
    </div>
  );
}

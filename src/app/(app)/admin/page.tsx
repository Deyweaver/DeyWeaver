import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Activity, Target } from 'lucide-react';

export default function AdminOverview() {
  // In a real application, we'd fetch these stats from the global /analytics collection
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card style={{ animationDelay: '0.1s' }} className="opacity-0 [animation-fill-mode:forwards]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Manage Users</div>
            <p className="text-xs text-muted-foreground mt-1">
              Synced from Firebase Auth
            </p>
          </CardContent>
        </Card>
        
        <Card style={{ animationDelay: '0.2s' }} className="opacity-0 [animation-fill-mode:forwards]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Health</CardTitle>
            <Activity className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-glow-purple">Optimal</div>
            <p className="text-xs text-muted-foreground mt-1">
              All services operational
            </p>
          </CardContent>
        </Card>

        <Card style={{ animationDelay: '0.3s' }} className="opacity-0 [animation-fill-mode:forwards]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Platform Activity</CardTitle>
            <Target className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">View Analytics</div>
            <p className="text-xs text-muted-foreground mt-1">
              Explore global metrics
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div 
        className="rounded-xl border border-primary/20 p-8 text-center glass-effect animate-slideUp opacity-0 [animation-fill-mode:forwards] neon-glow-hover"
        style={{ animationDelay: '0.4s' }}
      >
        <h3 className="text-2xl font-bold text-gradient">Welcome to the Admin Dashboard</h3>
        <p className="text-sm text-muted-foreground mt-4 max-w-xl mx-auto leading-relaxed">
          This secure area allows you to manage the DeyWeaver platform. You can view all registered users, promote users to admin status, and view global analytics.
        </p>
      </div>
    </div>
  );
}

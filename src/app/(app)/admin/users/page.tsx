'use client';

import { useEffect, useState } from 'react';
import { getAllUsers, setAdminStatus, type UserRecord } from '@/lib/user-db';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { IconSpinner } from '@/components/icons';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { auth } from '@/lib/firebase';
import { sendPasswordResetEmail } from 'firebase/auth';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // New User Form State
  const [newEmail, setNewEmail] = useState('');
  const [newName, setNewName] = useState('');
  const [newPassword, setNewPassword] = useState('');
  
  const { toast } = useToast();

  const loadUsers = async () => {
    setIsLoading(true);
    const allUsers = await getAllUsers();
    setUsers(allUsers);
    setIsLoading(false);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleAdminToggle = async (uid: string, currentStatus: boolean) => {
    try {
      const newStatus = !currentStatus;
      setUsers(users.map(u => u.uid === uid ? { ...u, isAdmin: newStatus } : u));
      await setAdminStatus(uid, newStatus);
      toast({ title: 'Status Updated', description: `Admin privileges have been ${newStatus ? 'granted' : 'revoked'}.` });
    } catch (error) {
      setUsers(users.map(u => u.uid === uid ? { ...u, isAdmin: currentStatus } : u));
      toast({ title: 'Error', description: 'Failed to update admin status.', variant: 'destructive' });
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    
    try {
      const token = await auth.currentUser?.getIdToken();
      
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          email: newEmail,
          displayName: newName,
          password: newPassword || undefined
        })
      });
      
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || 'Failed to create user');
      
      toast({
        title: 'User Created',
        description: 'Successfully created user account.',
      });
      
      setIsDialogOpen(false);
      setNewEmail('');
      setNewName('');
      setNewPassword('');
      loadUsers();
      
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleSendResetPassword = async (email: string | null) => {
    if (!email) return;
    try {
      await sendPasswordResetEmail(auth, email);
      toast({
        title: 'Email Sent',
        description: `Password reset email sent to ${email}`,
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'Never';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return format(date, 'MMM d, yyyy HH:mm');
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>User Management</CardTitle>
          <CardDescription>
            View all registered users and manage their access roles.
          </CardDescription>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>Create User</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New User</DialogTitle>
              <DialogDescription>
                Create a new user account. They will be added to the database instantly.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateUser}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Display Name</Label>
                  <Input id="name" value={newName} onChange={e => setNewName(e.target.value)} placeholder="John Doe" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={newEmail} onChange={e => setNewEmail(e.target.value)} required placeholder="john@example.com" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Password (Optional)</Label>
                  <Input id="password" type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="Auto-generated if left blank" />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={isCreating}>
                  {isCreating ? <IconSpinner className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Create User
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex min-h-[40vh] items-center justify-center">
            <IconSpinner className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Registered</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                    No users found.
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow key={user.uid}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarImage src={user.photoURL || undefined} alt={user.displayName || 'User'} />
                          <AvatarFallback>{user.displayName?.charAt(0) || 'U'}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="font-medium">{user.displayName || 'Unknown User'}</span>
                          <span className="text-xs text-muted-foreground">{user.email || 'No email provided'}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">
                      {formatDate(user.createdAt)}
                    </TableCell>
                    <TableCell className="text-sm">
                      {formatDate(user.lastLoginAt)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-4">
                        {user.email && (
                          <Button variant="outline" size="sm" onClick={() => handleSendResetPassword(user.email)}>
                            Reset Pass
                          </Button>
                        )}
                        <div className="flex items-center gap-2">
                          <Label className="text-xs text-muted-foreground">Admin</Label>
                          <Switch
                            checked={user.isAdmin || false}
                            onCheckedChange={() => handleAdminToggle(user.uid, user.isAdmin || false)}
                            aria-label="Toggle admin status"
                          />
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}

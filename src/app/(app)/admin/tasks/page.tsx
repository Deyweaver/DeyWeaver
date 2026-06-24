'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { PlusCircle, Search, Trash2 } from 'lucide-react';
import { getAllTasks, createTask, deleteTask } from '@/lib/tasks-db';
import { getAllUsers, type UserRecord } from '@/lib/user-db';
import type { Task, TaskStatus } from '@/types';
import { format, parseISO, isValid } from 'date-fns';
import { Badge } from '@/components/ui/badge';

export default function AdminTasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newTask, setNewTask] = useState<Partial<Task>>({ name: '', description: '', priority: 'medium', status: 'todo' });
  const [assignmentType, setAssignmentType] = useState<'global' | 'user'>('global');
  const [selectedUserId, setSelectedUserId] = useState<string>('');

  const { toast } = useToast();

  useEffect(() => {
    async function loadData() {
      try {
        const [loadedTasks, loadedUsers] = await Promise.all([
          getAllTasks(),
          getAllUsers()
        ]);
        setTasks(loadedTasks.filter(t => t.isGlobal || t.userId));
        setUsers(loadedUsers);
      } catch (error) {
        console.error(error);
        toast({ variant: 'destructive', title: 'Error', description: 'Failed to load tasks data' });
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [toast]);

  const handleCreateTask = async () => {
    if (!newTask.name?.trim()) {
      toast({ variant: 'destructive', title: 'Error', description: 'Task name is required' });
      return;
    }

    if (assignmentType === 'user' && !selectedUserId) {
      toast({ variant: 'destructive', title: 'Error', description: 'Please select a user to assign this task to' });
      return;
    }

    try {
      const taskData = {
        ...newTask,
        name: newTask.name.trim(),
        status: newTask.status || 'todo',
        isGlobal: assignmentType === 'global',
        userId: assignmentType === 'user' ? selectedUserId : null,
      };

      const newId = await createTask(taskData as Omit<Task, 'id'>);
      const addedTask = { id: newId, ...taskData } as Task;
      setTasks([addedTask, ...tasks]);
      setIsDialogOpen(false);
      setNewTask({ name: '', description: '', priority: 'medium', status: 'todo' });
      setAssignmentType('global');
      setSelectedUserId('');
      toast({ title: 'Success', description: 'Task created successfully' });
    } catch (error) {
      console.error(error);
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to create task' });
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await deleteTask(taskId);
      setTasks(tasks.filter(t => t.id !== taskId));
      toast({ title: 'Success', description: 'Task deleted' });
    } catch (error) {
      console.error(error);
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to delete task' });
    }
  };

  const filteredTasks = tasks.filter(task => 
    task.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Tasks Management</h2>
          <p className="text-muted-foreground">Create global tasks or assign tasks to specific users.</p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Create Task
        </Button>
      </div>

      <Card className="border-none shadow-md bg-card/50 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle>All Admin Tasks</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search tasks..."
                className="pl-8 bg-background/50"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-border/50">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Task Name</TableHead>
                  <TableHead>Assignment</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center h-24">Loading tasks...</TableCell>
                  </TableRow>
                ) : filteredTasks.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">No tasks found</TableCell>
                  </TableRow>
                ) : (
                  filteredTasks.map(task => {
                    const assignedUser = task.userId ? users.find(u => u.uid === task.userId) : null;
                    return (
                      <TableRow key={task.id}>
                        <TableCell className="font-medium">
                          {task.name}
                          {task.description && <p className="text-xs text-muted-foreground line-clamp-1">{task.description}</p>}
                        </TableCell>
                        <TableCell>
                          {task.isGlobal ? (
                            <Badge variant="default" className="bg-primary/20 text-primary border-none">Global</Badge>
                          ) : (
                            <Badge variant="outline">{assignedUser ? assignedUser.email : 'Unknown User'}</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge variant={task.status === 'done' ? 'outline' : 'secondary'} className={task.status === 'done' ? 'text-green-500' : ''}>
                            {task.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                           {task.dueDate && isValid(parseISO(task.dueDate)) ? format(parseISO(task.dueDate), 'MMM dd, yyyy') : '-'}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" onClick={() => handleDeleteTask(task.id)} className="text-destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create New Task</DialogTitle>
            <DialogDescription>Assign a task globally to all users or to a specific individual.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Task Name</Label>
              <Input id="name" value={newTask.name || ''} onChange={(e) => setNewTask({...newTask, name: e.target.value})} placeholder="E.g., Complete onboarding" />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea id="description" value={newTask.description || ''} onChange={(e) => setNewTask({...newTask, description: e.target.value})} placeholder="Task details..." />
            </div>

            <div className="grid gap-2">
              <Label>Assignment Type</Label>
              <Select value={assignmentType} onValueChange={(v: 'global' | 'user') => setAssignmentType(v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="global">Global (All Users)</SelectItem>
                  <SelectItem value="user">Specific User</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {assignmentType === 'user' && (
              <div className="grid gap-2">
                <Label>Select User</Label>
                <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a user" />
                  </SelectTrigger>
                  <SelectContent>
                    {users.map(user => (
                      <SelectItem key={user.uid} value={user.uid}>{user.email || user.displayName || user.uid}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="dueDate">Due Date</Label>
                <Input type="date" id="dueDate" value={newTask.dueDate ? newTask.dueDate.split('T')[0] : ''} onChange={(e) => setNewTask({...newTask, dueDate: e.target.value ? new Date(e.target.value).toISOString() : undefined})} />
              </div>
              <div className="grid gap-2">
                <Label>Priority</Label>
                <Select value={newTask.priority || 'medium'} onValueChange={(v: any) => setNewTask({...newTask, priority: v})}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleCreateTask}>Create Task</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

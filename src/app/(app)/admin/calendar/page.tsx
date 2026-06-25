'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { IconSpinner } from '@/components/icons';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { getAllEvents, createEvent, deleteEvent, CalendarEvent } from '@/lib/events-db';

export default function AdminCalendarPage() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newUserId, setNewUserId] = useState('');
  const [isGlobal, setIsGlobal] = useState(true);

  const { toast } = useToast();

  const loadEvents = async () => {
    setIsLoading(true);
    try {
      const allEvents = await getAllEvents();
      // sort by date desc
      allEvents.sort((a, b) => {
        const da = a.date?.toDate ? a.date.toDate() : new Date(a.date);
        const db = b.date?.toDate ? b.date.toDate() : new Date(b.date);
        return db.getTime() - da.getTime();
      });
      setEvents(allEvents);
    } catch (e: any) {
      toast({ title: 'Error loading events', description: e.message, variant: 'destructive' });
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    
    try {
      if (!newDate) throw new Error("Date is required");
      
      await createEvent({
        title: newTitle,
        description: newDescription,
        date: new Date(newDate),
        isGlobal,
        userId: isGlobal ? null : newUserId,
      });
      
      toast({ title: 'Event Created', description: 'Successfully created the event.' });
      
      setIsDialogOpen(false);
      setNewTitle('');
      setNewDescription('');
      setNewDate('');
      setNewUserId('');
      setIsGlobal(true);
      
      loadEvents();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteEvent = async (id: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return;
    try {
      await deleteEvent(id);
      toast({ title: 'Event Deleted' });
      setEvents(events.filter(e => e.id !== id));
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'No Date';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return format(date, 'MMM d, yyyy HH:mm');
  };

  return (
    <Card>
      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <CardTitle>Calendar & Events</CardTitle>
          <CardDescription>
            Manage global and user-specific calendar events.
          </CardDescription>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>Create Event</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Event</DialogTitle>
              <DialogDescription>
                Add a new event. It can be a global event for everyone, or specific to a user.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateEvent}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Event Title</Label>
                  <Input id="title" value={newTitle} onChange={e => setNewTitle(e.target.value)} required placeholder="Meeting with John" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Input id="description" value={newDescription} onChange={e => setNewDescription(e.target.value)} placeholder="Discuss project..." />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="date">Date & Time</Label>
                  <Input id="date" type="datetime-local" value={newDate} onChange={e => setNewDate(e.target.value)} required />
                </div>
                <div className="flex items-center gap-2">
                  <Label htmlFor="global">Global Event</Label>
                  <Switch id="global" checked={isGlobal} onCheckedChange={setIsGlobal} />
                </div>
                {!isGlobal && (
                  <div className="grid gap-2">
                    <Label htmlFor="userId">User ID</Label>
                    <Input id="userId" value={newUserId} onChange={e => setNewUserId(e.target.value)} required placeholder="Target user's UID" />
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button type="submit" disabled={isCreating}>
                  {isCreating ? <IconSpinner className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Save Event
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
                <TableHead>Event Title</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Scope</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {events.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                    No events found.
                  </TableCell>
                </TableRow>
              ) : (
                events.map((evt) => (
                  <TableRow key={evt.id}>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">{evt.title}</span>
                        <span className="text-xs text-muted-foreground">{evt.description}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">
                      {formatDate(evt.date)}
                    </TableCell>
                    <TableCell className="text-sm">
                      {evt.isGlobal ? (
                        <span className="text-primary font-medium">Global</span>
                      ) : (
                        <span className="text-muted-foreground">User: {evt.userId}</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="destructive" size="sm" onClick={() => handleDeleteEvent(evt.id)}>
                        Delete
                      </Button>
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

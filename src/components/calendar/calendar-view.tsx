'use client';

import { useState, useEffect, useMemo } from 'react';
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { format, parseISO, isValid, startOfDay } from 'date-fns';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CalendarDays, Star, PlusCircle, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { IconSpinner } from '@/components/icons';
import { useAuth } from '@/hooks/use-auth';
import { getUserEvents, createEvent, deleteEvent, CalendarEvent } from '@/lib/events-db';

export function CalendarView() {
  const [currentCalendarDate, setCurrentCalendarDate] = useState<Date | undefined>(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [isImportantDateModalOpen, setIsImportantDateModalOpen] = useState(false);
  
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newDate, setNewDate] = useState<Date | undefined>(new Date());

  const { toast } = useToast();
  const { user } = useAuth();

  const loadEvents = async () => {
    if (!user) {
      setEvents([]);
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    try {
      const allEvents = await getUserEvents(user.uid);
      setEvents(allEvents);
    } catch (error) {
      console.error("Error loading events:", error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadEvents();
  }, [user]);

  const eventsByDay = useMemo(() => {
    const map = new Map<string, CalendarEvent[]>();
    events.forEach(evt => {
      if (evt.date) {
        const d = evt.date.toDate ? evt.date.toDate() : new Date(evt.date);
        if (isValid(d)) {
          const dayStr = format(d, 'yyyy-MM-dd');
          if (!map.has(dayStr)) {
            map.set(dayStr, []);
          }
          map.get(dayStr)?.push(evt);
        }
      }
    });
    return map;
  }, [events]);

  const selectedDayItems: CalendarEvent[] = useMemo(() => {
    if (!currentCalendarDate) return [];
    const dayStr = format(currentCalendarDate, 'yyyy-MM-dd');
    return eventsByDay.get(dayStr) || [];
  }, [currentCalendarDate, eventsByDay]);

  const calendarModifiers = useMemo(() => {
    const modifiers: Record<string, Date[]> = {
      important: [],
      global: [],
    };
    events.forEach(evt => {
      if (evt.date) {
        const d = evt.date.toDate ? evt.date.toDate() : new Date(evt.date);
        if (isValid(d)) {
          if (evt.isGlobal) {
            modifiers.global.push(startOfDay(d));
          } else {
            modifiers.important.push(startOfDay(d));
          }
        }
      }
    });
    return modifiers;
  }, [events]);

  const calendarModifierStyles = {
    important: { borderColor: 'hsl(var(--accent))', borderWidth: '2px', borderRadius: 'var(--radius)' },
    global: { borderColor: 'hsl(var(--primary))', borderWidth: '2px', borderRadius: 'var(--radius)' }
  };

  const handleAddEvent = async () => {
    if (!user) {
      toast({ title: 'Error', description: 'You must be logged in to add an event.', variant: 'destructive' });
      return;
    }
    if (!newTitle.trim() || !newDate) {
      toast({ title: 'Error', description: 'Please provide a title and select a date.', variant: 'destructive' });
      return;
    }

    setIsCreating(true);
    try {
      await createEvent({
        title: newTitle.trim(),
        description: newDescription.trim(),
        date: newDate,
        isGlobal: false,
        userId: user.uid,
      });

      toast({
        title: 'Event Added',
        description: `"${newTitle}" has been added to your calendar.`,
      });
      
      setIsImportantDateModalOpen(false);
      setNewTitle('');
      setNewDescription('');
      setNewDate(new Date());
      loadEvents();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteEvent = async (id: string, isGlobal: boolean) => {
    if (isGlobal && !user?.isAdmin) {
      toast({ title: 'Error', description: 'You cannot delete global events.', variant: 'destructive' });
      return;
    }
    
    if (!confirm('Are you sure you want to delete this event?')) return;
    
    try {
      await deleteEvent(id);
      toast({ title: 'Event Deleted' });
      setEvents(events.filter(e => e.id !== id));
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  if (!user) {
    return (
      <Card className="text-center p-12">
        <CardTitle>Authentication Required</CardTitle>
        <CardDescription className="mt-2">Please log in to view and manage your calendar events.</CardDescription>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="md:col-span-2 shadow-lg">
        <CardHeader className="flex flex-row justify-between items-center">
          <CardTitle>Calendar</CardTitle>
           <Dialog open={isImportantDateModalOpen} onOpenChange={setIsImportantDateModalOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <PlusCircle className="h-4 w-4 mr-2" />
                Add Event
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Event</DialogTitle>
                <DialogDescription>
                  Add a personal event to your calendar.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="title" className="text-right">Title</Label>
                  <Input 
                    id="title" 
                    value={newTitle} 
                    onChange={(e) => setNewTitle(e.target.value)} 
                    className="col-span-3" 
                    placeholder="e.g., Doctor Appointment"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="desc" className="text-right">Description</Label>
                  <Input 
                    id="desc" 
                    value={newDescription} 
                    onChange={(e) => setNewDescription(e.target.value)} 
                    className="col-span-3" 
                    placeholder="Optional details..."
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="date" className="text-right">Date</Label>
                  <div className="col-span-3">
                    <Calendar
                        mode="single"
                        selected={newDate}
                        onSelect={setNewDate}
                        initialFocus
                        className="rounded-md border p-0 [&_button]:h-8 [&_button]:w-8 [&_caption_label]:text-sm [&_caption_label]:font-medium"
                      />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsImportantDateModalOpen(false)}>Cancel</Button>
                <Button onClick={handleAddEvent} disabled={isCreating}>
                  {isCreating && <IconSpinner className="mr-2 h-4 w-4 animate-spin" />}
                  Add Event
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent className="p-2 sm:p-4">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <IconSpinner className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <Calendar
              mode="single"
              selected={currentCalendarDate}
              onSelect={setCurrentCalendarDate}
              className="rounded-md border w-full"
              modifiers={calendarModifiers}
              modifiersStyles={calendarModifierStyles}
              footer={
                <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 text-xs p-2 border-t">
                  <div className="flex items-center"><span className="h-3 w-3 rounded-md border-2 mr-1.5" style={{borderColor: calendarModifierStyles.important.borderColor}}></span> Personal Event</div>
                  <div className="flex items-center"><span className="h-3 w-3 rounded-md border-2 mr-1.5" style={{borderColor: calendarModifierStyles.global.borderColor}}></span> Global Event</div>
                </div>
              }
            />
          )}
        </CardContent>
      </Card>

      <Card className="shadow-lg h-fit">
        <CardHeader>
          <CardTitle className="flex items-center">
            <CalendarDays className="h-6 w-6 mr-2 text-primary" />
            Events for {currentCalendarDate ? format(currentCalendarDate, 'PPP') : 'Selected Day'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {selectedDayItems.length > 0 ? (
            <ScrollArea className="h-[calc(100vh-20rem)] max-h-[450px] pr-3">
              <ul className="space-y-3">
                {selectedDayItems.map(item => (
                  <li key={item.id} className="p-3 bg-muted/50 rounded-md shadow-sm border border-transparent hover:border-border transition-colors">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center">
                          <Star className={`h-4 w-4 mr-2 ${item.isGlobal ? 'text-primary' : 'text-accent'}`} />
                          <span className="font-medium text-sm text-foreground">{item.title}</span>
                        </div>
                        {item.description && (
                          <p className="text-xs text-muted-foreground mt-1 ml-6">{item.description}</p>
                        )}
                        {item.isGlobal && (
                          <span className="inline-block mt-1 ml-6 text-[10px] font-medium bg-primary/20 text-primary px-2 py-0.5 rounded-full">Global</span>
                        )}
                      </div>
                      {(!item.isGlobal || user?.isAdmin) && (
                        <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-destructive" onClick={() => handleDeleteEvent(item.id, item.isGlobal)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </ScrollArea>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">
              {currentCalendarDate ? "No events for this day." : "Select a day to see events."}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { PlusCircle, Trash2, Megaphone } from 'lucide-react';
import { getAllAnnouncements, createAnnouncement, deleteAnnouncement, type Announcement } from '@/lib/announcements-db';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

export default function AdminAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newAnnouncement, setNewAnnouncement] = useState<Partial<Announcement>>({ title: '', message: '', type: 'info' });

  const { toast } = useToast();

  useEffect(() => {
    async function loadData() {
      try {
        const loadedAnnouncements = await getAllAnnouncements();
        setAnnouncements(loadedAnnouncements);
      } catch (error) {
        console.error(error);
        toast({ variant: 'destructive', title: 'Error', description: 'Failed to load announcements' });
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [toast]);

  const handleCreateAnnouncement = async () => {
    if (!newAnnouncement.title?.trim() || !newAnnouncement.message?.trim()) {
      toast({ variant: 'destructive', title: 'Error', description: 'Title and message are required' });
      return;
    }

    try {
      const data = {
        title: newAnnouncement.title.trim(),
        message: newAnnouncement.message.trim(),
        type: newAnnouncement.type || 'info',
      };

      const newId = await createAnnouncement(data as any);
      const added = { id: newId, ...data, createdAt: { toDate: () => new Date() } } as unknown as Announcement;
      setAnnouncements([added, ...announcements]);
      setIsDialogOpen(false);
      setNewAnnouncement({ title: '', message: '', type: 'info' });
      toast({ title: 'Success', description: 'Announcement published successfully' });
    } catch (error) {
      console.error(error);
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to publish announcement' });
    }
  };

  const handleDeleteAnnouncement = async (id: string) => {
    try {
      await deleteAnnouncement(id);
      setAnnouncements(announcements.filter(a => a.id !== id));
      toast({ title: 'Success', description: 'Announcement deleted' });
    } catch (error) {
      console.error(error);
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to delete announcement' });
    }
  };

  const getBadgeVariant = (type: string) => {
    switch (type) {
      case 'error': return 'destructive';
      case 'warning': return 'secondary';
      case 'success': return 'default';
      default: return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Announcements</h2>
          <p className="text-muted-foreground">Broadcast messages to all users on their dashboard.</p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)} className="w-full sm:w-auto">
          <PlusCircle className="mr-2 h-4 w-4" />
          New Announcement
        </Button>
      </div>

      <Card className="border-none shadow-md bg-card/50 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <CardTitle>Published Announcements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-border/50">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Title & Message</TableHead>
                  <TableHead>Date Published</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center h-24">Loading announcements...</TableCell>
                  </TableRow>
                ) : announcements.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center h-24 text-muted-foreground">No announcements found</TableCell>
                  </TableRow>
                ) : (
                  announcements.map(announcement => (
                    <TableRow key={announcement.id}>
                      <TableCell>
                        <Badge variant={getBadgeVariant(announcement.type)} className="capitalize">
                          {announcement.type}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-md">
                        <p className="font-medium">{announcement.title}</p>
                        <p className="text-xs text-muted-foreground line-clamp-2">{announcement.message}</p>
                      </TableCell>
                      <TableCell>
                        {announcement.createdAt?.toDate ? format(announcement.createdAt.toDate(), 'MMM dd, yyyy') : 'Just now'}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" onClick={() => handleDeleteAnnouncement(announcement.id)} className="text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Broadcast Announcement</DialogTitle>
            <DialogDescription>This will appear on the dashboard of every user.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" value={newAnnouncement.title || ''} onChange={(e) => setNewAnnouncement({...newAnnouncement, title: e.target.value})} placeholder="E.g., Scheduled Maintenance" />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="message">Message</Label>
              <Textarea id="message" value={newAnnouncement.message || ''} onChange={(e) => setNewAnnouncement({...newAnnouncement, message: e.target.value})} placeholder="Details..." />
            </div>

            <div className="grid gap-2">
              <Label>Type</Label>
              <Select value={newAnnouncement.type || 'info'} onValueChange={(v: any) => setNewAnnouncement({...newAnnouncement, type: v})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="info">Info</SelectItem>
                  <SelectItem value="success">Success</SelectItem>
                  <SelectItem value="warning">Warning</SelectItem>
                  <SelectItem value="error">Error</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleCreateAnnouncement}><Megaphone className="mr-2 h-4 w-4" /> Publish</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

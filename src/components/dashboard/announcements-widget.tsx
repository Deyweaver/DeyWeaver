'use client';

import { useEffect, useState } from 'react';
import { getAllAnnouncements, type Announcement } from '@/lib/announcements-db';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Info, AlertCircle, CheckCircle2, AlertTriangle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

export function AnnouncementsWidget() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    async function load() {
      try {
        const loaded = await getAllAnnouncements();
        setAnnouncements(loaded);
      } catch (err) {
        console.error("Failed to load announcements", err);
      }
    }
    load();
    
    // Load dismissed ids from local storage
    const stored = localStorage.getItem('dismissedAnnouncements');
    if (stored) {
      setDismissedIds(new Set(JSON.parse(stored)));
    }
  }, []);

  const handleDismiss = (id: string) => {
    const newDismissed = new Set(dismissedIds);
    newDismissed.add(id);
    setDismissedIds(newDismissed);
    localStorage.setItem('dismissedAnnouncements', JSON.stringify(Array.from(newDismissed)));
  };

  const visibleAnnouncements = announcements.filter(a => !dismissedIds.has(a.id));

  if (visibleAnnouncements.length === 0) return null;

  return (
    <div className="space-y-4 mb-8">
      <AnimatePresence>
        {visibleAnnouncements.map((announcement) => {
          let Icon = Info;
          let variant: "default" | "destructive" = "default";
          let bgClass = "bg-primary/10 border-primary/20 text-primary";

          switch (announcement.type) {
            case 'error':
              Icon = AlertCircle;
              variant = "destructive";
              bgClass = "";
              break;
            case 'warning':
              Icon = AlertTriangle;
              bgClass = "bg-yellow-500/10 border-yellow-500/20 text-yellow-600 dark:text-yellow-500";
              break;
            case 'success':
              Icon = CheckCircle2;
              bgClass = "bg-green-500/10 border-green-500/20 text-green-600 dark:text-green-500";
              break;
            case 'info':
            default:
              Icon = Info;
              bgClass = "bg-blue-500/10 border-blue-500/20 text-blue-600 dark:text-blue-500";
              break;
          }

          return (
            <motion.div
              key={announcement.id}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <Alert variant={variant} className={`relative shadow-md ${bgClass}`}>
                <Icon className="h-4 w-4" />
                <AlertTitle className="font-semibold">{announcement.title}</AlertTitle>
                <AlertDescription className="mt-1 opacity-90">
                  {announcement.message}
                </AlertDescription>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-2 h-6 w-6 opacity-70 hover:opacity-100"
                  onClick={() => handleDismiss(announcement.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </Alert>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

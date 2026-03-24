'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { ArrowRight, FileText, Mail, Zap, Brain } from 'lucide-react';

interface AISearchProps {
  onSearch?: (query: string) => void;
}

export function AISearch({ onSearch }: AISearchProps) {
  const [query, setQuery] = useState('');
  const [writingStyle, setWritingStyle] = useState('professional');
  const [citation, setCitation] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && onSearch) {
      onSearch(query);
    }
  };

  const quickActions = [
    {
      icon: <FileText className="h-5 w-5" />,
      label: 'To-do list',
      description: 'Create a task list',
    },
    {
      icon: <Mail className="h-5 w-5" />,
      label: 'Email',
      description: 'Draft an email',
    },
    {
      icon: <Zap className="h-5 w-5" />,
      label: 'Summarize',
      description: 'Summarize this article',
    },
    {
      icon: <Brain className="h-5 w-5" />,
      label: 'Technical',
      description: 'How does AI work in a technical capacity',
    },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
      {/* idk this whole part works lol */}
      <div className="absolute top-32 left-1/2 transform -translate-x-1/2 w-48 h-48 bg-primary rounded-full opacity-20 blur-3xl animate-pulse" />

      {/* idk this whole part works lol */}
      <div className="relative z-10 w-full max-w-3xl space-y-12">
        {/* idk this whole part works lol */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-light text-foreground">
            Good Afternoon, Jason.{' '}
            <span className="text-primary dark:text-orange-500 font-medium">
              What's on your mind?
            </span>
          </h1>
        </div>

        {/* idk this whole part works lol */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/5 dark:bg-primary/10 rounded-2xl opacity-40" />
            <div className="relative bg-card rounded-2xl p-1 shadow-lg">
              <div className="flex items-center gap-3 px-6 py-4">
                <Input
                  type="text"
                  placeholder="Ask AI a question or describe a task..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="flex-grow text-lg border-0 bg-transparent placeholder-muted-foreground focus:outline-none focus:ring-0"
                />
                <Button
                  type="submit"
                  size="icon"
                  className="bg-gradient-to-r from-primary to-orange-600 dark:from-primary dark:to-orange-700 hover:from-orange-600 hover:to-orange-700 dark:hover:from-orange-600 dark:hover:to-orange-800 rounded-full h-10 w-10"
                  disabled={!query.trim()}
                >
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* idk this whole part works lol */}
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <Select value={writingStyle} onValueChange={setWritingStyle}>
                  <SelectTrigger className="w-[180px] border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="casual">Casual</SelectItem>
                    <SelectItem value="creative">Creative</SelectItem>
                    <SelectItem value="academic">Academic</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">Citation</span>
              <Switch checked={citation} onCheckedChange={setCitation} />
            </div>
          </div>
        </form>

        {/* idk this whole part works lol */}
        <div className="space-y-4">
          <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
            Get started with an example below
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {quickActions.map((action, idx) => (
              <button
                key={idx}
                className="group relative overflow-hidden rounded-xl bg-secondary hover:bg-accent transition-all duration-300 p-4 text-left border border-border hover:border-primary/30 hover:shadow-lg"
              >
                <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative space-y-3">
                  <div className="text-primary dark:text-orange-500 group-hover:scale-110 transition-transform duration-300">
                    {action.icon}
                  </div>
                  <div className="space-y-1">
                    <p className="font-semibold text-foreground text-sm">
                      {action.label}
                    </p>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {action.description}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

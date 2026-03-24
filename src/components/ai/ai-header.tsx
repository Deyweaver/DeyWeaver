'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Plus, Share2, Search, ChevronDown } from 'lucide-react';

export function AIHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-card/80 dark:bg-background/80 backdrop-blur-md border-b border-border/50 z-50">
      <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        
        {/* idk this whole part works lol */}
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-2 hover:bg-secondary"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-orange-600 dark:from-primary dark:to-orange-700 flex items-center justify-center">
                  <span className="text-white text-xs font-bold">AI</span>
                </div>
                <span className="text-sm font-medium text-foreground">ChatGPT 4o</span>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem>ChatGPT 4o</DropdownMenuItem>
              <DropdownMenuItem>Claude 3.5 Sonnet</DropdownMenuItem>
              <DropdownMenuItem>Gemini 2.0</DropdownMenuItem>
              <DropdownMenuItem>Llama 3.1</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* idk this whole part works lol */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:bg-secondary"
            title="Search"
          >
            <Search className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:bg-secondary"
            title="Share"
          >
            <Share2 className="h-5 w-5" />
          </Button>
          <Button
            size="sm"
            className="bg-gradient-to-r from-primary to-orange-600 dark:from-primary dark:to-orange-700 hover:from-orange-600 hover:to-orange-700 dark:hover:from-orange-600 dark:hover:to-orange-800 text-white gap-2"
          >
            <Plus className="h-4 w-4" />
            New Thread
          </Button>
        </div>
      </div>
    </header>
  );
}

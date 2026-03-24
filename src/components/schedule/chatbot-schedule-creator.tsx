'use client';

import { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send, Loader, CheckCircle } from 'lucide-react';

interface TaskMessage {
  id: string;
  type: 'user' | 'ai' | 'task';
  content: string;
  timestamp: Date;
  tasks?: Array<{
    name: string;
    priority: 'low' | 'medium' | 'high';
    dueDate?: string;
  }>;
}

const examples = [
  {
    title: 'Daily Routine for Freelancer',
    description: 'Create a daily routine for a freelance writer working from home, who needs to finish a draft by Friday.',
    icon: '✍️',
  },
  {
    title: 'Study Schedule',
    description: 'Plan my study schedule for upcoming final exams in Math (high priority) and Physics (medium priority) next week.',
    icon: '📚',
  },
  {
    title: 'Project Planning',
    description: 'Organize my workflow: research (Monday), writing (Tuesday-Wednesday), review (Thursday), final edits (Friday).',
    icon: '📋',
  },
  {
    title: 'Weekly Goals',
    description: 'Create tasks for launching my new product including marketing, documentation, and customer support setup.',
    icon: '🎯',
  },
];

export function ChatbotScheduleCreator() {
  const [messages, setMessages] = useState<TaskMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [addedTasks, setAddedTasks] = useState(0);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleExampleClick = (example: (typeof examples)[0]) => {
    handleSubmit(example.description);
  };

  const handleSubmit = (query?: string) => {
    const textToSubmit = query || input;
    if (!textToSubmit.trim()) return;

    const userMessage: TaskMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: textToSubmit,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // quick thing here dont mind
    setTimeout(() => {
      const mockTasks = [
        { name: 'Complete project draft', priority: 'high' as const, dueDate: 'Friday' },
        { name: 'Review and edit', priority: 'medium' as const, dueDate: 'Thursday' },
        { name: 'Final submission', priority: 'high' as const, dueDate: 'Friday' },
      ];

      const aiMessage: TaskMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: "Perfect! I've identified 3 tasks from your request. Here's what I've extracted:",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
      setIsLoading(false);

      // quick thing here dont mind
      setTimeout(() => {
        const taskMessage: TaskMessage = {
          id: (Date.now() + 2).toString(),
          type: 'task',
          content: 'Adding tasks to your task list...',
          timestamp: new Date(),
          tasks: mockTasks,
        };
        setMessages((prev) => [...prev, taskMessage]);
        setAddedTasks((prev) => prev + mockTasks.length);
      }, 500);
    }, 1500);
  };

  if (!isMounted) {
    return null;
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* idk this whole part works lol */}
      {addedTasks > 0 && (
        <div className="bg-green-50 border-b border-green-200 px-6 py-3 flex items-center gap-2 text-green-700">
          <CheckCircle className="h-5 w-5" />
          <span className="font-medium">{addedTasks} task{addedTasks !== 1 ? 's' : ''} added to your task list!</span>
        </div>
      )}

      {/* idk this whole part works lol */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full space-y-8">
            {/* idk this whole part works lol */}
            <div className="w-32 h-32">
              <div className="w-full h-full rounded-full bg-primary opacity-20 blur-3xl animate-pulse" />
            </div>

            {/* idk this whole part works lol */}
            <div className="text-center space-y-3">
              <h1 className="text-4xl font-light text-foreground">
                Good Afternoon, Jason
              </h1>
              <p className="text-xl text-muted-foreground">
                What do you want to <span className="text-primary dark:text-orange-500 font-semibold">accomplish today?</span>
              </p>
            </div>

            {/* idk this whole part works lol */}
            <div className="w-full max-w-3xl space-y-4">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/5 rounded-2xl opacity-40" />
                <div className="relative bg-card rounded-2xl p-1 shadow-lg">
                  <div className="flex items-center gap-3 px-6 py-4">
                    <Input
                      type="text"
                      placeholder="Describe your ideal schedule and let AI create tasks..."
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
                      className="flex-grow text-lg border-0 bg-transparent placeholder-gray-400 focus:outline-none focus:ring-0"
                    />
                    <Button
                      type="button"
                      size="icon"
                      onClick={() => handleSubmit()}
                      className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 rounded-full h-10 w-10"
                      disabled={!input.trim()}
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <div key={message.id} className="animate-fadeIn">
                {message.type === 'user' && (
                  <div className="flex justify-end">
                    <div className="max-w-md bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-3 rounded-lg rounded-br-none shadow-md">
                      <p className="text-sm leading-relaxed">{message.content}</p>
                      <span className="text-xs opacity-70 mt-2 block">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                )}

                {message.type === 'ai' && (
                  <div className="flex justify-start">
                    <div className="max-w-md bg-secondary dark:bg-muted text-foreground px-4 py-3 rounded-lg rounded-bl-none shadow-md">
                      <p className="text-sm leading-relaxed">{message.content}</p>
                      <span className="text-xs text-muted-foreground mt-2 block">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                )}

                {message.type === 'task' && message.tasks && (
                  <div className="flex justify-start">
                    <div className="max-w-2xl bg-secondary dark:bg-muted rounded-lg rounded-bl-none shadow-md p-4 space-y-3">
                      <p className="text-sm font-medium text-foreground flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        {message.content}
                      </p>
                      <div className="space-y-2 pl-6">
                        {message.tasks.map((task, idx) => (
                          <div
                            key={idx}
                            className="animate-slideRight flex items-start gap-3 p-3 rounded-lg bg-secondary/30 border border-border"
                          >
                            <div className="mt-1">
                              <div className="w-2 h-2 rounded-full bg-orange-500" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-foreground">{task.name}</p>
                              <div className="flex gap-2 mt-1 flex-wrap">
                                <span className={`text-xs px-2 py-1 rounded-full ${
                                  task.priority === 'high' ? 'bg-red-100 text-red-700' :
                                  task.priority === 'medium' ? 'bg-orange-100 text-orange-700' :
                                  'bg-green-100 text-green-700'
                                }`}>
                                  {task.priority} priority
                                </span>
                                {task.dueDate && (
                                  <span className="text-xs px-2 py-1 rounded-full bg-secondary dark:bg-muted text-foreground">
                                    Due: {task.dueDate}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-card px-4 py-3 rounded-lg rounded-bl-none flex items-center gap-2 shadow-md">
                  <Loader className="h-4 w-4 animate-spin text-orange-600" />
                  <span className="text-sm text-muted-foreground">AI is processing...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* idk this whole part works lol */}
      {messages.length === 0 && (
        <div className="border-t border-border bg-card p-6 px-8">
          <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-4">
            Try one of these prompts
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {examples.map((example, idx) => (
              <button
                key={idx}
                onClick={() => handleExampleClick(example)}
                className="group relative overflow-hidden rounded-xl bg-gray-50 hover:bg-gray-100 transition-all duration-300 p-4 text-left border border-gray-200 hover:border-orange-300 hover:shadow-lg text-sm"
              >
                <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative space-y-2">
                  <div className="text-2xl">{example.icon}</div>
                  <div className="space-y-1">
                    <p className="font-semibold text-foreground">{example.title}</p>
                    <p className="text-xs text-muted-foreground line-clamp-2">{example.description}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* idk this whole part works lol */}
      {messages.length > 0 && !isLoading && (
        <div className="border-t border-border bg-card p-6">
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/5 rounded-2xl opacity-40" />
              <div className="relative bg-card rounded-2xl p-1 shadow-lg">
                <div className="flex items-center gap-3 px-6 py-4">
                  <Input
                    type="text"
                    placeholder="Add more tasks or adjust your schedule..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
                    className="flex-grow text-lg border-0 bg-transparent placeholder-gray-400 focus:outline-none focus:ring-0"
                  />
                  <Button
                    type="button"
                    size="icon"
                    onClick={() => handleSubmit()}
                    className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 rounded-full h-10 w-10"
                    disabled={!input.trim()}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

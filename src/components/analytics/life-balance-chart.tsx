'use client';

import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { handleAnalyzeLifeBalance } from '@/lib/actions';
import { getTasksFromLocalStorage } from '@/lib/task-storage';
import type { Task } from '@/types';
import { IconSpinner } from '@/components/icons';
import { Lightbulb, TrendingUp } from 'lucide-react';
import type { AnalyzeLifeBalanceOutput } from '@/ai/flows/analyze-life-balance';

const COLORS = {
  'Work/Career': '#f97316', // ngl this is just here
  'Health & Wellness': '#10b981', // quick thing here dont mind
  'Relationships': '#8b5cf6', // kinda important maybe
  'Personal Growth': '#3b82f6', // we vibin this works
  'Fun & Entertainment': '#ec4899', // ngl this is just here
  'Finance': '#eab308', // quick thing here dont mind
  'Home & Environment': '#6366f1', // idk this does stuff lol
};

export function LifeBalanceChart() {
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [insight, setInsight] = useState<string | null>(null);
  const [recommendation, setRecommendation] = useState<string | null>(null);
  const [totalTasks, setTotalTasks] = useState(0);
  const [inputTaskCount, setInputTaskCount] = useState(0);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      const tasks = getTasksFromLocalStorage();
      setInputTaskCount(tasks.length);

      if (tasks.length === 0) {
        setCategories([]);
        setInsight("No tasks yet. Start adding tasks to see your life balance!");
        setRecommendation("Create tasks in different life areas (work, health, relationships, etc.) to track your balance.");
        setTotalTasks(0);
        setIsLoading(false);
        return;
      }

      try {
        const aiTasks = tasks.map(task => ({
          name: task.name,
          description: task.description,
          dueDate: task.dueDate,
          priority: task.priority,
          status: task.status,
          category: task.category,
        }));

        const result: AnalyzeLifeBalanceOutput = await handleAnalyzeLifeBalance({ 
          tasks: aiTasks,
          timeframe: 'this week'
        });

        setCategories(result.categories);
        setInsight(result.balanceInsight);
        setRecommendation(result.recommendation);
        setTotalTasks(result.totalTasks);
      } catch (error) {
        console.error("Error fetching life balance analysis:", error);
        setInsight("Could not analyze life balance. Make sure you have tasks added.");
        setRecommendation("Try adding more tasks to different life areas.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();

    const handleTasksUpdated = () => {
      fetchData();
    };

    const handleWindowFocus = () => {
      fetchData();
    };

    window.addEventListener('deyweaver-tasks-updated', handleTasksUpdated);
    window.addEventListener('focus', handleWindowFocus);

    return () => {
      window.removeEventListener('deyweaver-tasks-updated', handleTasksUpdated);
      window.removeEventListener('focus', handleWindowFocus);
    };
  }, []);

  const chartData = categories.map(cat => ({
    name: cat.name,
    value: cat.count,
    percentage: cat.percentage,
  }));

  return (
    <Card className="shadow-lg h-full flex flex-col">
      <CardHeader>
        <CardTitle>Task Type Balance</CardTitle>
        <CardDescription>
          {isLoading ? "AI is analyzing your task types..." : `Distribution of your ${totalTasks} tasks across life categories and balance insights`}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0 space-y-6">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <IconSpinner className="h-12 w-12 text-primary" />
          </div>
        ) : categories.length > 0 ? (
          <>
            {/* idk this whole part works lol */}
            <div className="flex items-center justify-center h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percentage }) => `${name}: ${percentage}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categories.map((entry: any) => (
                      <Cell key={`cell-${entry.name}`} fill={COLORS[entry.name as keyof typeof COLORS] || '#808080'} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: any) => `${value} tasks`}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* idk this whole part works lol */}
            <div className="space-y-3 max-h-[250px] overflow-y-auto">
              <h3 className="font-semibold text-sm text-foreground">Breakdown by Category:</h3>
              {categories.map((cat: any) => (
                <div key={cat.name} className="p-3 rounded-lg bg-secondary/50 dark:bg-muted/50 border border-border">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: COLORS[cat.name as keyof typeof COLORS] || '#808080' }}
                        />
                        <span className="font-medium text-sm">{cat.name}</span>
                        <span className="text-xs text-primary font-bold">{cat.percentage}%</span>
                      </div>
                      <p className="text-xs text-muted-foreground">{cat.description}</p>
                      {cat.tasks && cat.tasks.length > 0 && (
                        <div className="text-xs text-muted-foreground mt-1 italic">
                          Examples: {cat.tasks.slice(0, 2).join(', ')}
                        </div>
                      )}
                    </div>
                    <div className="px-2 py-1 bg-background rounded text-xs font-semibold text-primary">
                      {cat.count} task{cat.count !== 1 ? 's' : ''}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* idk this whole part works lol */}
            {insight && (
              <div className="p-4 rounded-lg bg-primary/10 dark:bg-primary/20 border border-primary/30 space-y-2">
                <div className="flex items-start gap-2">
                  <Lightbulb className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-sm text-foreground">Life Balance Insight</h4>
                    <p className="text-sm text-muted-foreground">{insight}</p>
                  </div>
                </div>
              </div>
            )}

            {/* idk this whole part works lol */}
            {recommendation && (
              <div className="p-4 rounded-lg bg-secondary/50 dark:bg-muted/50 border border-border space-y-2">
                <div className="flex items-start gap-2">
                  <TrendingUp className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-sm text-foreground">Recommendation</h4>
                    <p className="text-sm text-muted-foreground">{recommendation}</p>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <p className="text-muted-foreground mb-2">
              {inputTaskCount > 0 ? 'Tasks found, but analysis is not available yet' : 'No tasks to analyze yet'}
            </p>
            <p className="text-sm text-muted-foreground">{recommendation}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

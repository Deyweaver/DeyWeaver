
'use server';

import { 
  createSchedule as createScheduleFlow, 
  type CreateScheduleInput,
  type CreateScheduleOutput
} from '@/ai/flows/create-schedule';

import {
  analyzeTimeUsage as analyzeTimeUsageFlow,
  type AnalyzeTimeUsageInput,
  type AnalyzeTimeUsageOutput
} from '@/ai/flows/analyze-time-usage';

import {
  calculateEfficiencyScore as calculateEfficiencyScoreFlow,
  type CalculateEfficiencyScoreInput,
  type CalculateEfficiencyScoreOutput
} from '@/ai/flows/calculate-efficiency-score';

import {
  predictBurnout as predictBurnoutFlow,
  type PredictBurnoutInput,
  type PredictBurnoutOutput
} from '@/ai/flows/predict-burnout';

import {
  analyzeLifeBalance as analyzeLifeBalanceFlow,
  type AnalyzeLifeBalanceInput,
  type AnalyzeLifeBalanceOutput
} from '@/ai/flows/analyze-life-balance';

import {
  summarizeEmails as summarizeEmailsFlow,
  type SummarizeEmailsInput,
  type SummarizeEmailsOutput,
} from '@/ai/flows/summarize-emails';

const LIFE_CATEGORY_DEFINITIONS: Array<{
  name: string;
  description: string;
  keywords: string[];
  color: string;
}> = [
  {
    name: 'Work/Career',
    description: 'Professional tasks, projects, meetings, and career work.',
    keywords: ['work', 'office', 'meeting', 'project', 'client', 'career', 'job', 'deadline'],
    color: '#f97316',
  },
  {
    name: 'Health & Wellness',
    description: 'Fitness, medical, sleep, nutrition, and self-care tasks.',
    keywords: ['gym', 'workout', 'health', 'doctor', 'meditation', 'sleep', 'diet', 'run', 'walk'],
    color: '#10b981',
  },
  {
    name: 'Relationships',
    description: 'Family, friends, social, and communication activities.',
    keywords: ['family', 'friend', 'call', 'social', 'relationship', 'partner', 'parents'],
    color: '#8b5cf6',
  },
  {
    name: 'Personal Growth',
    description: 'Learning, study, reading, and skill development.',
    keywords: ['study', 'learn', 'course', 'read', 'practice', 'skill', 'exam', 'book'],
    color: '#3b82f6',
  },
  {
    name: 'Fun & Entertainment',
    description: 'Leisure, hobbies, gaming, and entertainment.',
    keywords: ['movie', 'game', 'fun', 'travel', 'music', 'hobby', 'netflix', 'youtube'],
    color: '#ec4899',
  },
  {
    name: 'Finance',
    description: 'Budgeting, bills, savings, and financial planning.',
    keywords: ['bill', 'budget', 'finance', 'money', 'investment', 'tax', 'payment'],
    color: '#eab308',
  },
  {
    name: 'Home & Environment',
    description: 'Home maintenance, errands, cleaning, and organization.',
    keywords: ['clean', 'home', 'kitchen', 'laundry', 'grocery', 'errand', 'organize'],
    color: '#6366f1',
  },
];

function inferLifeCategory(task: AnalyzeLifeBalanceInput['tasks'][number]): (typeof LIFE_CATEGORY_DEFINITIONS)[number] {
  const combined = `${task.category || ''} ${task.name || ''} ${task.description || ''}`.toLowerCase();

  for (const definition of LIFE_CATEGORY_DEFINITIONS) {
    if (definition.keywords.some((keyword) => combined.includes(keyword))) {
      return definition;
    }
  }

  return LIFE_CATEGORY_DEFINITIONS[0];
}

function buildLifeBalanceFallback(input: AnalyzeLifeBalanceInput): AnalyzeLifeBalanceOutput {
  const totalTasks = input.tasks.length;
  if (totalTasks === 0) {
    return {
      categories: [],
      totalTasks: 0,
      balanceInsight: 'No tasks available yet for analysis.',
      recommendation: 'Start by adding tasks to different life areas to get insights.',
    };
  }

  const grouped = new Map<string, { count: number; tasks: string[]; definition: (typeof LIFE_CATEGORY_DEFINITIONS)[number] }>();

  for (const task of input.tasks) {
    const definition = inferLifeCategory(task);
    const existing = grouped.get(definition.name);

    if (existing) {
      existing.count += 1;
      if (existing.tasks.length < 3) {
        existing.tasks.push(task.name);
      }
      continue;
    }

    grouped.set(definition.name, {
      count: 1,
      tasks: [task.name],
      definition,
    });
  }

  const categories = Array.from(grouped.values())
    .sort((a, b) => b.count - a.count)
    .map((entry) => ({
      name: entry.definition.name,
      count: entry.count,
      percentage: Number(((entry.count / totalTasks) * 100).toFixed(1)),
      description: entry.definition.description,
      color: entry.definition.color,
      tasks: entry.tasks,
    }));

  const top = categories[0];
  const balanceInsight =
    top && top.percentage >= 60
      ? `Most of your tasks are concentrated in ${top.name}. Consider diversifying your weekly focus.`
      : 'Your tasks are reasonably spread across multiple life areas.';

  return {
    categories,
    totalTasks,
    balanceInsight,
    recommendation: 'Add clear categories while creating tasks for even more accurate AI life-balance insights.',
  };
}


export async function handleCreateSchedule(input: CreateScheduleInput): Promise<CreateScheduleOutput> {
  try {
    const result = await createScheduleFlow(input);
    // ngl this is just here
    return { ...result, tasks: result.tasks || [] };
  } catch (error) {
    console.error('Error in handleCreateSchedule:', error);
    throw new Error('Failed to create schedule. Please try again.');
  }
}

export async function handleAnalyzeTimeUsage(input: AnalyzeTimeUsageInput): Promise<AnalyzeTimeUsageOutput> {
  try {
    const result = await analyzeTimeUsageFlow(input);
    return result;
  } catch (error) {
    console.error('Error in handleAnalyzeTimeUsage:', error);
    // this part be doing work fr
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const;
    const fallbackWeeklyUsage = days.map(day => ({
      day: day, Study: 0, Work: 0, Personal: 0, Chill: 1, Sleep: 7
    }));
    return { 
      weeklyUsage: fallbackWeeklyUsage, 
      analysisSummary: "Error analyzing time usage. Displaying default estimates." 
    };
  }
}

export async function handleCalculateEfficiencyScore(input: CalculateEfficiencyScoreInput): Promise<CalculateEfficiencyScoreOutput> {
  try {
    const result = await calculateEfficiencyScoreFlow(input);
    return result;
  } catch (error) {
    console.error('Error in handleCalculateEfficiencyScore:', error);
    return { 
      score: 0, 
      message: "Error calculating efficiency score.",
      improvementSuggestion: "Please try again later."
    };
  }
}

export async function handlePredictBurnout(input: PredictBurnoutInput): Promise<PredictBurnoutOutput> {
  try {
    const result = await predictBurnoutFlow(input);
    return result;
  } catch (error) {
    console.error('Error in handlePredictBurnout:', error);
    return { 
      riskLevel: 'medium', 
      progressValue: 50,
      message: "Error predicting burnout risk. Please monitor your well-being.",
      contributingFactors: ["Analysis service unavailable"]
    };
  }
}

export async function handleAnalyzeLifeBalance(input: AnalyzeLifeBalanceInput): Promise<AnalyzeLifeBalanceOutput> {
  try {
    const result = await analyzeLifeBalanceFlow(input);

    if (input.tasks.length > 0 && result.categories.length === 0) {
      return buildLifeBalanceFallback(input);
    }

    return result;
  } catch (error) {
    console.error('Error in handleAnalyzeLifeBalance:', error);
    return buildLifeBalanceFallback(input);
  }
}

export async function handleSummarizeEmails(input: SummarizeEmailsInput): Promise<SummarizeEmailsOutput> {
  try {
    return await summarizeEmailsFlow(input);
  } catch (error) {
    console.error('Error in handleSummarizeEmails:', error);
    return {
      summaries: input.emails.map((email) => ({
        emailId: email.id,
        bullets: [
          `From ${email.from || 'Unknown sender'}`,
          email.subject ? `Subject: ${email.subject}` : 'Unread email needs review.',
          email.snippet || 'Open the email to review the details.',
        ].filter((item) => item.trim().length > 0).slice(0, 3),
        suggestedTaskTitle: email.subject ? `Review: ${email.subject}`.slice(0, 70) : 'Review unread email',
        suggestedTaskDescription: (email.snippet || email.body || 'Review this unread email and capture any follow-up.')
          .slice(0, 180),
        suggestedCategory: 'Email',
        priority: 'medium',
      })),
    };
  }
}

export interface WeatherResult {
  ok: boolean;
  temperatureC: number;
  condition: string;
  windKmh: number;
  locationLabel: string;
  error?: string;
}

export interface QuoteResult {
  ok: boolean;
  quote: string;
  author: string;
  error?: string;
}

export interface NewsItem {
  title: string;
  url: string;
}

export interface TopNewsResult {
  ok: boolean;
  items: NewsItem[];
  source: string;
  error?: string;
}

type OpenMeteoResponse = {
  current?: {
    temperature_2m?: number;
    weather_code?: number;
    wind_speed_10m?: number;
  };
};

type OpenMeteoGeocodingResponse = {
  results?: Array<{
    name?: string;
    country?: string;
    latitude?: number;
    longitude?: number;
  }>;
};

type ZenQuotesResponse = Array<{
  q?: string;
  a?: string;
}>;

type RedditWorldNewsResponse = {
  data?: {
    children?: Array<{
      data?: {
        title?: string;
        url?: string;
      };
    }>;
  };
};

async function fetchJsonWithTimeout<T>(url: string, timeoutMs = 9000): Promise<T> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      cache: 'no-store',
      headers: {
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    return (await response.json()) as T;
  } finally {
    clearTimeout(timeoutId);
  }
}

function weatherCodeToText(code: number): string {
  if (code === 0) return 'Clear sky';
  if (code === 1 || code === 2) return 'Partly cloudy';
  if (code === 3) return 'Overcast';
  if (code === 45 || code === 48) return 'Foggy';
  if (code >= 51 && code <= 67) return 'Rain showers';
  if (code >= 71 && code <= 77) return 'Snow';
  if (code >= 80 && code <= 82) return 'Rain';
  if (code >= 95) return 'Thunderstorm';
  return 'Variable conditions';
}

export async function handleFetchWeather(input: { latitude: number; longitude: number }): Promise<WeatherResult> {
  const fallback: WeatherResult = {
    ok: false,
    temperatureC: 0,
    condition: 'Unavailable',
    windKmh: 0,
    locationLabel: 'Your location',
    error: 'Unable to fetch weather right now.',
  };

  if (!Number.isFinite(input.latitude) || !Number.isFinite(input.longitude)) {
    return {
      ...fallback,
      error: 'Invalid location coordinates.',
    };
  }

  const latitude = Number(input.latitude.toFixed(4));
  const longitude = Number(input.longitude.toFixed(4));

  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    current: 'temperature_2m,weather_code,wind_speed_10m',
    timezone: 'auto',
  });

  try {
    const data = await fetchJsonWithTimeout<OpenMeteoResponse>(`https://api.open-meteo.com/v1/forecast?${params.toString()}`);
    const current = data.current;

    if (!current || typeof current.temperature_2m !== 'number') {
      return fallback;
    }

    return {
      ok: true,
      temperatureC: Math.round(current.temperature_2m),
      condition: weatherCodeToText(current.weather_code ?? -1),
      windKmh: Math.round(current.wind_speed_10m ?? 0),
      locationLabel: `Lat ${latitude.toFixed(2)}, Lon ${longitude.toFixed(2)}`,
    };
  } catch (error) {
    console.error('Error fetching weather:', error);
    return fallback;
  }
}

export async function handleFetchWeatherByLocationName(input: { location: string }): Promise<WeatherResult> {
  const normalizedLocation = input.location.trim();
  if (normalizedLocation.length === 0) {
    return {
      ok: false,
      temperatureC: 0,
      condition: 'Unavailable',
      windKmh: 0,
      locationLabel: 'Custom location',
      error: 'Please provide a location name.',
    };
  }

  try {
    const geoParams = new URLSearchParams({
      name: normalizedLocation,
      count: '1',
      language: 'en',
      format: 'json',
    });

    const geocoding = await fetchJsonWithTimeout<OpenMeteoGeocodingResponse>(
      `https://geocoding-api.open-meteo.com/v1/search?${geoParams.toString()}`
    );

    const first = geocoding.results?.[0];
    if (!first || typeof first.latitude !== 'number' || typeof first.longitude !== 'number') {
      return {
        ok: false,
        temperatureC: 0,
        condition: 'Unavailable',
        windKmh: 0,
        locationLabel: normalizedLocation,
        error: 'Could not find that location.',
      };
    }

    const weather = await handleFetchWeather({
      latitude: first.latitude,
      longitude: first.longitude,
    });

    if (!weather.ok) {
      return {
        ...weather,
        locationLabel: normalizedLocation,
      };
    }

    return {
      ...weather,
      locationLabel: first.country ? `${first.name}, ${first.country}` : first.name || normalizedLocation,
    };
  } catch (error) {
    console.error('Error fetching weather by location name:', error);
    return {
      ok: false,
      temperatureC: 0,
      condition: 'Unavailable',
      windKmh: 0,
      locationLabel: normalizedLocation,
      error: 'Unable to fetch weather for that location right now.',
    };
  }
}

export async function handleFetchQuote(): Promise<QuoteResult> {
  const fallback: QuoteResult = {
    ok: false,
    quote: 'Progress is built one focused day at a time.',
    author: 'Dey Weaver',
    error: 'Unable to fetch quote right now.',
  };

  try {
    const data = await fetchJsonWithTimeout<ZenQuotesResponse>('https://zenquotes.io/api/random', 7000);
    const first = data[0];

    if (!first?.q) {
      return fallback;
    }

    return {
      ok: true,
      quote: first.q,
      author: first.a || 'Unknown',
    };
  } catch (error) {
    console.error('Error fetching quote:', error);
    return fallback;
  }
}

export async function handleFetchTopNews(): Promise<TopNewsResult> {
  const fallbackItems: NewsItem[] = [
    {
      title: 'Catch up with world updates from your preferred news source.',
      url: 'https://news.google.com/home?hl=en-US&gl=US&ceid=US:en',
    },
    {
      title: 'Open Reuters World News for global coverage.',
      url: 'https://www.reuters.com/world/',
    },
    {
      title: 'Browse BBC World for breaking stories.',
      url: 'https://www.bbc.com/news/world',
    },
  ];

  const fallback: TopNewsResult = {
    ok: false,
    items: fallbackItems,
    source: 'Fallback sources',
    error: 'Unable to fetch top news right now.',
  };

  try {
    const data = await fetchJsonWithTimeout<RedditWorldNewsResponse>(
      'https://www.reddit.com/r/worldnews/top.json?limit=6&t=day',
      9000
    );

    const items =
      data.data?.children
        ?.map((child) => ({
          title: child.data?.title?.trim() || '',
          url: child.data?.url?.trim() || '',
        }))
        .filter((item) => item.title.length > 0 && /^https?:\/\//.test(item.url))
        .slice(0, 3) || [];

    if (items.length === 0) {
      return fallback;
    }

    return {
      ok: true,
      items,
      source: 'r/worldnews (English)',
    };
  } catch (error) {
    console.error('Error fetching top news:', error);
    return fallback;
  }
}

    

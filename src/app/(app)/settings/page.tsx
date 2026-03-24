'use client';

import { useState, useEffect } from 'react';
import { ThemeToggleSwitch } from '@/components/settings/theme-toggle-switch';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'zh', name: 'Chinese', flag: '🇨🇳' },
  { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
  { code: 'de', name: 'German', flag: '🇩🇪' },
  { code: 'fr', name: 'French', flag: '🇫🇷' },
  { code: 'es', name: 'Spanish', flag: '🇪🇸' },
];

export default function SettingsPage() {
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // Load saved language from localStorage
    const savedLanguage = localStorage.getItem('preferredLanguage') || 'en';
    setSelectedLanguage(savedLanguage);
  }, []);

  const handleLanguageChange = (languageCode: string) => {
    setSelectedLanguage(languageCode);
    localStorage.setItem('preferredLanguage', languageCode);
    // Here you could add logic to change the UI language
    // For now, just saving the preference
  };

  if (!isMounted) {
    return null;
  }

  return (
    <div className="max-w-3xl space-y-8">
      <div className="space-y-3">
        <h1 className="text-4xl font-light text-foreground">Settings</h1>
        <p className="text-lg text-muted-foreground">
          Manage your account and preferences.
        </p>
      </div>

      {/* Appearance Settings */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="space-y-4">
          <div className="border-b border-border pb-4">
            <h2 className="text-2xl font-semibold text-foreground">Appearance</h2>
            <p className="text-sm text-muted-foreground mt-2">Adjust the look and feel of the application.</p>
          </div>
          <ThemeToggleSwitch />
        </div>
      </div>

      {/* Language Settings */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="space-y-4">
          <div className="border-b border-border pb-4">
            <h2 className="text-2xl font-semibold text-foreground">Language</h2>
            <p className="text-sm text-muted-foreground mt-2">Choose your preferred language for the entire website.</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {languages.map((language) => (
              <button
                key={language.code}
                onClick={() => handleLanguageChange(language.code)}
                className={`relative flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition-all ${
                  selectedLanguage === language.code
                    ? 'border-primary bg-primary/10 dark:bg-primary/20'
                    : 'border-border bg-secondary dark:bg-muted hover:border-primary/50'
                }`}
              >
                <span className="text-xl">{language.flag}</span>
                <span className={`text-sm font-medium ${
                  selectedLanguage === language.code ? 'text-primary' : 'text-foreground'
                }`}>
                  {language.name}
                </span>
                {selectedLanguage === language.code && (
                  <Check className="absolute top-1 right-1 h-4 w-4 text-primary" />
                )}
              </button>
            ))}
          </div>
          <div className="mt-6">
            <p className="text-sm text-muted-foreground mb-2">
              Current language: <span className="font-semibold text-foreground">{languages.find(l => l.code === selectedLanguage)?.name}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

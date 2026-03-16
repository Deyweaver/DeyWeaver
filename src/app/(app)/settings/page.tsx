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
        <h1 className="text-4xl font-light text-gray-900">Settings</h1>
        <p className="text-lg text-gray-600">
          Manage your account and preferences.
        </p>
      </div>

      {/* Appearance Settings */}
      <div className="rounded-2xl border border-gray-200/50 bg-white p-6 shadow-sm">
        <div className="space-y-4">
          <div className="border-b border-gray-200 pb-4">
            <h2 className="text-2xl font-semibold text-gray-900">Appearance</h2>
            <p className="text-sm text-gray-600 mt-2">Adjust the look and feel of the application.</p>
          </div>
          <ThemeToggleSwitch />
        </div>
      </div>

      {/* Language Settings */}
      <div className="rounded-2xl border border-gray-200/50 bg-white p-6 shadow-sm">
        <div className="space-y-4">
          <div className="border-b border-gray-200 pb-4">
            <h2 className="text-2xl font-semibold text-gray-900">Language</h2>
            <p className="text-sm text-gray-600 mt-2">Choose your preferred language for the entire website.</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {languages.map((language) => (
              <button
                key={language.code}
                onClick={() => handleLanguageChange(language.code)}
                className={`relative flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition-all ${
                  selectedLanguage === language.code
                    ? 'border-orange-500 bg-orange-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <span className="text-xl">{language.flag}</span>
                <span className={`text-sm font-medium ${
                  selectedLanguage === language.code ? 'text-orange-700' : 'text-gray-700'
                }`}>
                  {language.name}
                </span>
                {selectedLanguage === language.code && (
                  <Check className="absolute top-1 right-1 h-4 w-4 text-orange-600" />
                )}
              </button>
            ))}
          </div>
          <div className="mt-6">
            <p className="text-sm text-gray-600 mb-2">
              Current language: <span className="font-semibold text-gray-900">{languages.find(l => l.code === selectedLanguage)?.name}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

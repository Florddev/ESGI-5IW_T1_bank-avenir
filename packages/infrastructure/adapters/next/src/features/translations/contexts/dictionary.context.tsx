'use client';

import { createContext, useContext, ReactNode } from 'react';
import type { Dictionary } from '@workspace/translations/types';

interface DictionaryContextType {
  dict: Dictionary;
  locale: string;
}

const DictionaryContext = createContext<DictionaryContextType | undefined>(undefined);

interface DictionaryProviderProps {
  children: ReactNode;
  dict: Dictionary;
  locale: string;
}

export function DictionaryProvider({ children, dict, locale }: DictionaryProviderProps) {
  return (
    <DictionaryContext.Provider value={{ dict, locale }}>
      {children}
    </DictionaryContext.Provider>
  );
}

export function useDictionary() {
  const context = useContext(DictionaryContext);
  if (context === undefined) {
    throw new Error('useDictionary must be used within a DictionaryProvider');
  }
  return context;
}

// Helper function to replace placeholders like {{name}}
export function translate(text: string, params?: Record<string, string | number>): string {
  if (!params) return text;
  
  return Object.entries(params).reduce((acc, [key, value]) => {
    return acc.replace(new RegExp(`{{${key}}}`, 'g'), String(value));
  }, text);
}

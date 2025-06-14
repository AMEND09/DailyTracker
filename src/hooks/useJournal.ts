import { useState, useEffect } from 'react';
import { JournalEntry } from '../types';

const JOURNAL_STORAGE_KEY = 'journal-entries';

export const useJournal = () => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);

  useEffect(() => {
    const savedEntries = localStorage.getItem(JOURNAL_STORAGE_KEY);
    if (savedEntries) {
      try {
        setEntries(JSON.parse(savedEntries));
      } catch (error) {
        console.error('Error loading journal entries:', error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(JOURNAL_STORAGE_KEY, JSON.stringify(entries));
  }, [entries]);

  const addEntry = (entry: Omit<JournalEntry, 'id'>) => {
    const newEntry: JournalEntry = {
      ...entry,
      id: Date.now().toString()
    };
    setEntries(prev => [newEntry, ...prev]);
  };

  const updateEntry = (id: string, updates: Partial<JournalEntry>) => {
    setEntries(prev => 
      prev.map(entry => 
        entry.id === id ? { ...entry, ...updates } : entry
      )
    );
  };

  const deleteEntry = (id: string) => {
    setEntries(prev => prev.filter(entry => entry.id !== id));
  };

  const getTodayEntry = () => {
    const today = new Date().toDateString();
    return entries.find(entry => new Date(entry.date).toDateString() === today);
  };

  return {
    entries,
    addEntry,
    updateEntry,
    deleteEntry,
    getTodayEntry
  };
};
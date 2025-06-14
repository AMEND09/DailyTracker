import React, { useState } from 'react';
import { BookOpen, Plus, Edit3, Trash2, Smile, Meh, Frown, Heart } from 'lucide-react';
import { useJournal } from '../hooks/useJournal';
import { JournalEntry } from '../types';

export const Journal: React.FC = () => {
  const { entries, addEntry, updateEntry, deleteEntry, getTodayEntry } = useJournal();
  const [showNewEntry, setShowNewEntry] = useState(false);
  const [editingEntry, setEditingEntry] = useState<string | null>(null);
  const [newEntry, setNewEntry] = useState({
    content: '',
    mood: 'good' as const,
    highlights: ['']
  });

  const todayEntry = getTodayEntry();

  const handleSaveEntry = () => {
    if (newEntry.content.trim()) {
      addEntry({
        date: new Date().toISOString(),
        content: newEntry.content,
        mood: newEntry.mood,
        highlights: newEntry.highlights.filter(h => h.trim())
      });
      setNewEntry({ content: '', mood: 'good', highlights: [''] });
      setShowNewEntry(false);
    }
  };

  const getMoodIcon = (mood: JournalEntry['mood']) => {
    switch (mood) {
      case 'great': return <Heart className="w-4 h-4 text-red-500" />;
      case 'good': return <Smile className="w-4 h-4 text-green-500" />;
      case 'okay': return <Meh className="w-4 h-4 text-yellow-500" />;
      case 'bad': return <Frown className="w-4 h-4 text-red-500" />;
    }
  };

  const addHighlight = () => {
    setNewEntry(prev => ({ ...prev, highlights: [...prev.highlights, ''] }));
  };

  const updateHighlight = (index: number, value: string) => {
    setNewEntry(prev => ({
      ...prev,
      highlights: prev.highlights.map((h, i) => i === index ? value : h)
    }));
  };

  const removeHighlight = (index: number) => {
    setNewEntry(prev => ({
      ...prev,
      highlights: prev.highlights.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-3">
          <BookOpen className="w-8 h-8 text-amber-600" />
          <h1 className="text-3xl font-bold text-stone-800">Journal</h1>
        </div>
        
        {!todayEntry && (
          <button
            onClick={() => setShowNewEntry(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>New Entry</span>
          </button>
        )}
      </div>

      {showNewEntry && (
        <div className="bg-white rounded-xl border border-stone-200 p-6 mb-8">
          <h2 className="text-xl font-semibold text-stone-800 mb-4">Today's Entry</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">
                How was your day?
              </label>
              <div className="flex space-x-4">
                {(['great', 'good', 'okay', 'bad'] as const).map(mood => (
                  <button
                    key={mood}
                    onClick={() => setNewEntry(prev => ({ ...prev, mood }))}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg border transition-colors ${
                      newEntry.mood === mood
                        ? 'border-amber-500 bg-amber-50'
                        : 'border-stone-300 hover:border-stone-400'
                    }`}
                  >
                    {getMoodIcon(mood)}
                    <span className="capitalize">{mood}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">
                What happened today?
              </label>
              <textarea
                value={newEntry.content}
                onChange={(e) => setNewEntry(prev => ({ ...prev, content: e.target.value }))}
                className="w-full h-32 px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="Write about your day..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">
                Highlights
              </label>
              {newEntry.highlights.map((highlight, index) => (
                <div key={index} className="flex items-center space-x-2 mb-2">
                  <input
                    type="text"
                    value={highlight}
                    onChange={(e) => updateHighlight(index, e.target.value)}
                    className="flex-1 px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder="Something good that happened..."
                  />
                  {newEntry.highlights.length > 1 && (
                    <button
                      onClick={() => removeHighlight(index)}
                      className="p-2 text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
              <button
                onClick={addHighlight}
                className="text-sm text-amber-600 hover:text-amber-700"
              >
                + Add highlight
              </button>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={handleSaveEntry}
                className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
              >
                Save Entry
              </button>
              <button
                onClick={() => setShowNewEntry(false)}
                className="px-4 py-2 bg-stone-300 text-stone-700 rounded-lg hover:bg-stone-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {entries.map(entry => (
          <div key={entry.id} className="bg-white rounded-xl border border-stone-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                {getMoodIcon(entry.mood)}
                <h3 className="text-lg font-semibold text-stone-800">
                  {new Date(entry.date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </h3>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setEditingEntry(entry.id)}
                  className="p-2 text-stone-400 hover:text-amber-600"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => deleteEntry(entry.id)}
                  className="p-2 text-stone-400 hover:text-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <p className="text-stone-700 mb-4 whitespace-pre-wrap">{entry.content}</p>
            
            {entry.highlights.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-stone-600 mb-2">Highlights:</h4>
                <ul className="space-y-1">
                  {entry.highlights.map((highlight, index) => (
                    <li key={index} className="text-sm text-stone-600 flex items-center space-x-2">
                      <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>

      {entries.length === 0 && !showNewEntry && (
        <div className="text-center py-12">
          <BookOpen className="w-16 h-16 text-stone-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-stone-600 mb-2">No journal entries yet</h3>
          <p className="text-stone-500 mb-4">Start documenting your daily journey</p>
          <button
            onClick={() => setShowNewEntry(true)}
            className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
          >
            Write your first entry
          </button>
        </div>
      )}
    </div>
  );
};
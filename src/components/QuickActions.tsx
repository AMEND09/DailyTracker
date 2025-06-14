import React from 'react';
import { BookOpen, Calendar, BarChart3, Settings } from 'lucide-react';

interface QuickActionsProps {
  onJournalClick: () => void;
  onCalendarClick: () => void;
  onStatsClick: () => void;
  onSettingsClick: () => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({
  onJournalClick,
  onCalendarClick,
  onStatsClick,
  onSettingsClick
}) => {
  const actions = [
    { icon: BookOpen, label: 'Journal', onClick: onJournalClick },
    { icon: Calendar, label: 'Calendar', onClick: onCalendarClick },
    { icon: BarChart3, label: 'Statistics', onClick: onStatsClick },
    { icon: Settings, label: 'Settings', onClick: onSettingsClick }
  ];

  return (
    <div className="grid grid-cols-2 gap-4">
      {actions.map(({ icon: Icon, label, onClick }) => (
        <button
          key={label}
          onClick={onClick}
          className="p-6 bg-white rounded-xl border border-stone-200 hover:border-amber-200 hover:shadow-md transition-all duration-200 text-center group"
        >
          <Icon className="w-8 h-8 text-amber-600 mx-auto mb-3 group-hover:text-amber-700 transition-colors" />
          <span className="text-sm font-medium text-stone-700 group-hover:text-stone-800 transition-colors">
            {label}
          </span>
        </button>
      ))}
    </div>
  );
};
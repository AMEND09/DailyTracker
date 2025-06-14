import React, { useState } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { useStats } from '../hooks/useStats';

export const Calendar: React.FC = () => {
  const { stats } = useStats();
  const [currentDate, setCurrentDate] = useState(new Date());

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const getStatsForDate = (day: number) => {
    const dateStr = new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toDateString();
    return stats.find(stat => new Date(stat.date).toDateString() === dateStr);
  };

  const getCompletionColor = (completionRate: number) => {
    if (completionRate >= 90) return 'bg-green-500';
    if (completionRate >= 70) return 'bg-amber-500';
    if (completionRate >= 50) return 'bg-orange-500';
    if (completionRate > 0) return 'bg-red-400';
    return 'bg-stone-200';
  };

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const today = new Date();
  const isCurrentMonth = currentDate.getMonth() === today.getMonth() && currentDate.getFullYear() === today.getFullYear();

  const days = [];
  
  // Empty cells for days before the first day of the month
  for (let i = 0; i < firstDay; i++) {
    days.push(<div key={`empty-${i}`} className="h-12"></div>);
  }

  // Days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const dayStats = getStatsForDate(day);
    const isToday = isCurrentMonth && day === today.getDate();
    const isPast = new Date(currentDate.getFullYear(), currentDate.getMonth(), day) < today;
    
    days.push(
      <div
        key={day}
        className={`h-12 flex flex-col items-center justify-center rounded-lg border transition-colors ${
          isToday ? 'border-amber-500 bg-amber-50' : 'border-stone-200'
        }`}
      >
        <span className={`text-sm font-medium ${isToday ? 'text-amber-700' : 'text-stone-700'}`}>
          {day}
        </span>
        {dayStats && (
          <div
            className={`w-2 h-2 rounded-full mt-1 ${getCompletionColor(dayStats.completionRate)}`}
            title={`${dayStats.completionRate}% completed`}
          />
        )}
        {isPast && !dayStats && (
          <div className="w-2 h-2 rounded-full mt-1 bg-stone-300" />
        )}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-3">
          <CalendarIcon className="w-8 h-8 text-amber-600" />
          <h1 className="text-3xl font-bold text-stone-800">Calendar</h1>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-stone-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-stone-800">
            {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </h2>
          <div className="flex space-x-2">
            <button
              onClick={() => navigateMonth('prev')}
              className="p-2 text-stone-600 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => navigateMonth('next')}
              className="p-2 text-stone-600 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-2 mb-4">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="h-8 flex items-center justify-center">
              <span className="text-sm font-medium text-stone-600">{day}</span>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2">
          {days}
        </div>

        <div className="mt-6 px-2">
          <div className="grid grid-cols-1 xs:grid-cols-2 gap-2 xs:gap-3 max-w-sm mx-auto sm:max-w-none sm:flex sm:items-center sm:justify-center sm:gap-6">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-green-500 flex-shrink-0"></div>
              <span className="text-xs sm:text-sm text-stone-600 truncate">90%+ completed</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-amber-500 flex-shrink-0"></div>
              <span className="text-xs sm:text-sm text-stone-600 truncate">70-89% completed</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-orange-500 flex-shrink-0"></div>
              <span className="text-xs sm:text-sm text-stone-600 truncate">50-69% completed</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-red-400 flex-shrink-0"></div>
              <span className="text-xs sm:text-sm text-stone-600 truncate">Below 50%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
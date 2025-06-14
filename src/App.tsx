import React, { useState, useEffect } from 'react';
import { Calendar, TrendingUp, Clock, Target, Flame, Award, ArrowLeft } from 'lucide-react';
import { useDailyTasks } from './hooks/useDailyTasks';
import { useStats } from './hooks/useStats';
import { TaskCard } from './components/TaskCard';
import { ProgressRing } from './components/ProgressRing';
import { StatCard } from './components/StatCard';
import { QuickActions } from './components/QuickActions';
import { DailySummary } from './components/DailySummary';
import { Journal } from './components/Journal';
import { Calendar as CalendarView } from './components/Calendar';
import { Statistics } from './components/Statistics';
import { Settings } from './components/Settings';

type View = 'dashboard' | 'journal' | 'calendar' | 'statistics' | 'settings';

function App() {
  const { tasks, toggleTask, updateTaskData, completedCount, totalTasks, completionPercentage } = useDailyTasks();
  const { addDailyStats } = useStats();
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [currentStreak] = useState(0); // Will be calculated from stats
  const [weeklyAverage] = useState(0); // Will be calculated from stats

  // Save daily stats when tasks change
  useEffect(() => {
    const exerciseTasks = tasks.filter(task => task.type === 'exercise' && task.completed);
    const calorieTask = tasks.find(task => task.type === 'calories');
    
    const totalDistance = exerciseTasks.reduce((sum, task) => sum + (task.data?.distance || 0), 0);
    const totalDuration = exerciseTasks.reduce((sum, task) => sum + (task.data?.duration || 0), 0);
    const totalCalories = calorieTask?.data?.calories || 0;

    const dailyStats = {
      date: new Date().toISOString(),
      completionRate: completionPercentage,
      totalDistance,
      totalDuration,
      totalCalories,
      tasksCompleted: completedCount,
      totalTasks
    };

    addDailyStats(dailyStats);
  }, [tasks, completionPercentage, completedCount, totalTasks, addDailyStats]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const getMotivationalMessage = () => {
    if (completionPercentage === 100) return 'Perfect day! 🎉';
    if (completionPercentage >= 80) return 'Almost there! Keep pushing! 💪';
    if (completionPercentage >= 50) return 'Great progress so far! 🚀';
    if (completionPercentage >= 25) return 'Good start! Keep building momentum! ⭐';
    return 'Ready to tackle your goals? 🎯';
  };

  if (currentView !== 'dashboard') {
    return (
      <div className="min-h-screen bg-stone-50">
        <div className="bg-white border-b border-stone-200 px-4 py-4">
          <button
            onClick={() => setCurrentView('dashboard')}
            className="flex items-center space-x-2 text-stone-600 hover:text-amber-600 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Dashboard</span>
          </button>
        </div>
        
        {currentView === 'journal' && <Journal />}
        {currentView === 'calendar' && <CalendarView />}
        {currentView === 'statistics' && <Statistics />}
        {currentView === 'settings' && <Settings />}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white rounded-2xl p-6 mb-8 border border-stone-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-stone-800">{getGreeting()}</h1>
              <p className="text-stone-600">Ready to conquer your summer goals?</p>
            </div>
            <div className="flex items-center space-x-2 bg-amber-100 px-3 py-2 rounded-full">
              <Flame className="w-4 h-4 text-amber-600" />
              <span className="text-sm font-medium text-amber-700">
                Day {currentStreak} Streak
              </span>
            </div>
          </div>

          {/* Progress Overview */}
          <div className="flex items-center justify-center py-6">
            <ProgressRing progress={completionPercentage} size={120}>
              <div className="text-center">
                <div className="text-2xl font-bold text-stone-800">{completedCount}</div>
                <div className="text-xs text-stone-500">of {totalTasks}</div>
              </div>
            </ProgressRing>
          </div>

          <div className="text-center">
            <p className="text-lg font-medium text-stone-700 mb-1">
              {getMotivationalMessage()}
            </p>
            <p className="text-sm text-stone-500">
              {completionPercentage}% complete today
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-stone-800 mb-4">Quick Actions</h2>
          <QuickActions
            onJournalClick={() => setCurrentView('journal')}
            onCalendarClick={() => setCurrentView('calendar')}
            onStatsClick={() => setCurrentView('statistics')}
            onSettingsClick={() => setCurrentView('settings')}
          />
        </div>

        {/* Daily Summary */}
        <DailySummary tasks={tasks} completionPercentage={completionPercentage} />

        {/* Progress Stats */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-stone-800 mb-4">Your Progress</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard
              title="Today"
              value={`${completionPercentage}%`}
              subtitle="Tasks completed"
              icon={<Target className="w-5 h-5" />}
              color="orange"
            />
            <StatCard
              title="This Week"
              value={`${weeklyAverage}%`}
              subtitle="Weekly average"
              icon={<TrendingUp className="w-5 h-5" />}
              color="green"
            />
            <StatCard
              title="Current Streak"
              value={currentStreak}
              subtitle="Days in a row"
              icon={<Flame className="w-5 h-5" />}
              color="amber"
            />
            <StatCard
              title="Total Tasks"
              value={totalTasks}
              subtitle="Daily goals"
              icon={<Award className="w-5 h-5" />}
              color="blue"
            />
          </div>
        </div>

        {/* Daily Tasks */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-stone-800 mb-4">Today's Goals</h2>
          <div className="space-y-3">
            {tasks.map(task => (
              <TaskCard
                key={task.id}
                task={task}
                onToggle={toggleTask}
                onUpdateData={updateTaskData}
              />
            ))}
          </div>
        </div>

        {/* Motivation Footer */}
        <div className="bg-gradient-to-r from-amber-100 to-orange-100 rounded-2xl p-6 text-center">
          <h3 className="font-semibold text-stone-800 mb-2">
            "Success is the sum of small efforts repeated day in and day out."
          </h3>
          <p className="text-sm text-stone-600">
            Keep building those habits! Every task completed is a step toward your goals.
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
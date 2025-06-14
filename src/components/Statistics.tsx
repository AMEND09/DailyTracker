import React from 'react';
import { BarChart3, TrendingUp, Target, Calendar, Award, Flame } from 'lucide-react';
import { useStats } from '../hooks/useStats';
import { StatCard } from './StatCard';

export const Statistics: React.FC = () => {
  const { stats, getWeeklyStats, getMonthlyStats } = useStats();
  
  const weeklyStats = getWeeklyStats();
  const monthlyStats = getMonthlyStats();
  
  const calculateAverage = (data: number[]) => {
    if (data.length === 0) return 0;
    return Math.round(data.reduce((sum, val) => sum + val, 0) / data.length);
  };

  const weeklyAverage = calculateAverage(weeklyStats.map(s => s.completionRate));
  const monthlyAverage = calculateAverage(monthlyStats.map(s => s.completionRate));
  
  const totalDistance = monthlyStats.reduce((sum, s) => sum + s.totalDistance, 0);
  const totalDuration = monthlyStats.reduce((sum, s) => sum + s.totalDuration, 0);
  const totalCalories = monthlyStats.reduce((sum, s) => sum + s.totalCalories, 0);
  
  const currentStreak = calculateCurrentStreak();
  const longestStreak = calculateLongestStreak();

  function calculateCurrentStreak(): number {
    if (stats.length === 0) return 0;
    
    const sortedStats = [...stats].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    let streak = 0;
    
    for (const stat of sortedStats) {
      if (stat.completionRate >= 80) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  }

  function calculateLongestStreak(): number {
    if (stats.length === 0) return 0;
    
    const sortedStats = [...stats].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    let maxStreak = 0;
    let currentStreak = 0;
    
    for (const stat of sortedStats) {
      if (stat.completionRate >= 80) {
        currentStreak++;
        maxStreak = Math.max(maxStreak, currentStreak);
      } else {
        currentStreak = 0;
      }
    }
    
    return maxStreak;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center space-x-3 mb-8">
        <BarChart3 className="w-8 h-8 text-amber-600" />
        <h1 className="text-3xl font-bold text-stone-800">Statistics</h1>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="This Week"
          value={`${weeklyAverage}%`}
          subtitle="Average completion"
          icon={<Calendar className="w-5 h-5" />}
          color="green"
        />
        <StatCard
          title="This Month"
          value={`${monthlyAverage}%`}
          subtitle="Average completion"
          icon={<TrendingUp className="w-5 h-5" />}
          color="blue"
        />
        <StatCard
          title="Current Streak"
          value={currentStreak}
          subtitle="Days above 80%"
          icon={<Flame className="w-5 h-5" />}
          color="amber"
        />
        <StatCard
          title="Best Streak"
          value={longestStreak}
          subtitle="Personal record"
          icon={<Award className="w-5 h-5" />}
          color="orange"
        />
      </div>

      {/* Activity Summary */}
      <div className="bg-white rounded-xl border border-stone-200 p-6 mb-8">
        <h2 className="text-xl font-semibold text-stone-800 mb-6">Monthly Activity Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-amber-600 mb-2">{totalDistance.toFixed(1)}</div>
            <div className="text-sm text-stone-600">Miles Traveled</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">{Math.round(totalDuration / 60)}</div>
            <div className="text-sm text-stone-600">Hours Exercised</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">{totalCalories.toLocaleString()}</div>
            <div className="text-sm text-stone-600">Calories Tracked</div>
          </div>
        </div>
      </div>

      {/* Recent Performance */}
      <div className="bg-white rounded-xl border border-stone-200 p-6">
        <h2 className="text-xl font-semibold text-stone-800 mb-6">Recent Performance</h2>
        
        {weeklyStats.length > 0 ? (
          <div className="space-y-4">
            {weeklyStats.slice(0, 7).map(stat => (
              <div key={stat.date} className="flex items-center justify-between p-3 bg-stone-50 rounded-lg">
                <div>
                  <div className="font-medium text-stone-800">
                    {new Date(stat.date).toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </div>
                  <div className="text-sm text-stone-600">
                    {stat.tasksCompleted} of {stat.totalTasks} tasks completed
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <div className="font-semibold text-stone-800">{stat.completionRate}%</div>
                    {stat.totalDistance > 0 && (
                      <div className="text-xs text-stone-500">{stat.totalDistance} mi</div>
                    )}
                  </div>
                  <div className={`w-3 h-3 rounded-full ${
                    stat.completionRate >= 90 ? 'bg-green-500' :
                    stat.completionRate >= 70 ? 'bg-amber-500' :
                    stat.completionRate >= 50 ? 'bg-orange-500' : 'bg-red-400'
                  }`} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Target className="w-12 h-12 text-stone-300 mx-auto mb-4" />
            <p className="text-stone-500">No data available yet. Complete some tasks to see your statistics!</p>
          </div>
        )}
      </div>
    </div>
  );
};
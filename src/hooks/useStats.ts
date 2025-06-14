import { useState, useEffect } from 'react';
import { DailyStats } from '../types';

const STATS_STORAGE_KEY = 'daily-stats';

export const useStats = () => {
  const [stats, setStats] = useState<DailyStats[]>([]);

  useEffect(() => {
    const savedStats = localStorage.getItem(STATS_STORAGE_KEY);
    if (savedStats) {
      try {
        setStats(JSON.parse(savedStats));
      } catch (error) {
        console.error('Error loading stats:', error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STATS_STORAGE_KEY, JSON.stringify(stats));
  }, [stats]);

  const addDailyStats = (dailyStats: DailyStats) => {
    setStats(prev => {
      const existing = prev.find(s => s.date === dailyStats.date);
      if (existing) {
        return prev.map(s => s.date === dailyStats.date ? dailyStats : s);
      }
      return [...prev, dailyStats];
    });
  };

  const getWeeklyStats = () => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    return stats.filter(stat => new Date(stat.date) >= oneWeekAgo);
  };

  const getMonthlyStats = () => {
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    
    return stats.filter(stat => new Date(stat.date) >= oneMonthAgo);
  };

  return {
    stats,
    addDailyStats,
    getWeeklyStats,
    getMonthlyStats
  };
};
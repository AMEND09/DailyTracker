import { useState, useEffect } from 'react';
import { Bike, Wallet as Walk, GraduationCap, Users, StampIcon as Standing, Apple, Briefcase, Code, BookOpen, Sun } from 'lucide-react';
import { DailyTask } from '../types';

const STORAGE_KEY = 'daily-tasks';
const LAST_RESET_KEY = 'last-reset-date';

export const useDailyTasks = () => {
  const [tasks, setTasks] = useState<DailyTask[]>([
    {
      id: 'wake-up',
      title: 'Wake up by 7:00 AM',
      description: 'Start the day early and energized',
      completed: false,
      timeTarget: 'By 7:00 AM',
      type: 'simple',
      icon: <Sun className="w-4 h-4" />
    },
    {
      id: 'cycle-10',
      title: 'Cycle 10 miles',
      description: 'Morning cardio session',
      completed: false,
      timeTarget: '45-60 minutes',
      type: 'exercise',
      data: { distance: 0, duration: 0 },
      icon: <Bike className="w-4 h-4" />
    },
    {
      id: 'walk-pack',
      title: 'Walk 1 mile with pack',
      description: 'Build endurance and strength',
      completed: false,
      timeTarget: '15-20 minutes',
      type: 'exercise',
      data: { distance: 0, duration: 0 },
      icon: <Walk className="w-4 h-4" />
    },
    {
      id: 'homework',
      title: 'Do homework',
      description: 'Complete daily assignments',
      completed: false,
      type: 'simple',
      icon: <GraduationCap className="w-4 h-4" />
    },
    {
      id: 'boy-scouts',
      title: 'Work on Boy Scouts Project',
      description: 'Make progress on current project',
      completed: false,
      type: 'simple',
      icon: <Users className="w-4 h-4" />
    },
    {
      id: 'standing-work',
      title: 'Do all work while standing',
      description: 'Maintain good posture and health',
      completed: false,
      type: 'simple',
      icon: <Standing className="w-4 h-4" />
    },
    {
      id: 'calories',
      title: 'Track daily calorie intake',
      description: 'Monitor nutrition and health',
      completed: false,
      type: 'calories',
      data: { calories: 0 },
      icon: <Apple className="w-4 h-4" />
    },
    {
      id: 'cycle-5',
      title: 'Cycle 5 miles',
      description: 'Evening exercise session',
      completed: false,
      timeTarget: '25-30 minutes',
      type: 'exercise',
      data: { distance: 0, duration: 0 },
      icon: <Bike className="w-4 h-4" />
    },
    {
      id: 'tsa-work',
      title: 'Do TSA work',
      description: 'Technology Student Association tasks',
      completed: false,
      type: 'simple',
      icon: <Briefcase className="w-4 h-4" />
    },
    {
      id: 'software-dev',
      title: 'Work on Software Development',
      description: 'Code practice and projects',
      completed: false,
      type: 'simple',
      icon: <Code className="w-4 h-4" />
    },
    {
      id: 'journal',
      title: 'Journal',
      description: 'Reflect on the day and plan tomorrow',
      completed: false,
      timeTarget: '10-15 minutes',
      type: 'simple',
      icon: <BookOpen className="w-4 h-4" />
    }
  ]);

  // Check if tasks need to be reset (new day)
  useEffect(() => {
    const resetTasksIfNewDay = () => {
      const today = new Date().toDateString();
      const lastReset = localStorage.getItem(LAST_RESET_KEY);
      
      if (lastReset !== today) {
        setTasks(prevTasks => 
          prevTasks.map(task => ({ 
            ...task, 
            completed: false,
            data: task.type === 'exercise' ? { distance: 0, duration: 0 } :
                  task.type === 'calories' ? { calories: 0 } : task.data
          }))
        );
        localStorage.setItem(LAST_RESET_KEY, today);
      }
    };

    resetTasksIfNewDay();
  }, []);

  // Load tasks from localStorage
  useEffect(() => {
    const savedTasks = localStorage.getItem(STORAGE_KEY);
    if (savedTasks) {
      try {
        const parsedTasks = JSON.parse(savedTasks);
        setTasks(prevTasks => 
          prevTasks.map(task => {
            const savedTask = parsedTasks.find((t: DailyTask) => t.id === task.id);
            return savedTask ? { ...task, completed: savedTask.completed, data: savedTask.data } : task;
          })
        );
      } catch (error) {
        console.error('Error loading tasks:', error);
      }
    }
  }, []);

  // Save tasks to localStorage when they change
  useEffect(() => {
    const tasksToSave = tasks.map(({ icon, ...task }) => task);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasksToSave));
  }, [tasks]);

  const toggleTask = (taskId: string) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const updateTaskData = (taskId: string, data: any) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId ? { ...task, data: { ...task.data, ...data } } : task
      )
    );
  };

  const completedCount = tasks.filter(task => task.completed).length;
  const completionPercentage = Math.round((completedCount / tasks.length) * 100);

  return {
    tasks,
    toggleTask,
    updateTaskData,
    completedCount,
    totalTasks: tasks.length,
    completionPercentage
  };
};
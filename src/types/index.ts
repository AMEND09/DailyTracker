export interface DailyTask {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  timeTarget?: string;
  icon?: React.ReactNode;
  type: 'simple' | 'exercise' | 'calories';
  data?: {
    distance?: number;
    duration?: number;
    calories?: number;
  };
}

export interface JournalEntry {
  id: string;
  date: string;
  content: string;
  mood: 'great' | 'good' | 'okay' | 'bad';
  highlights: string[];
}

export interface DailyStats {
  date: string;
  completionRate: number;
  totalDistance: number;
  totalDuration: number;
  totalCalories: number;
  tasksCompleted: number;
  totalTasks: number;
}

export interface Settings {
  wakeUpTime: string;
  notifications: boolean;
  theme: 'light' | 'dark';
  weekStartsOn: 'sunday' | 'monday';
}
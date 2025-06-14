import React from 'react';
import { Calendar, Target, Activity, Apple } from 'lucide-react';
import { DailyTask } from '../types';

interface DailySummaryProps {
  tasks: DailyTask[];
  completionPercentage: number;
}

export const DailySummary: React.FC<DailySummaryProps> = ({ tasks, completionPercentage }) => {
  const exerciseTasks = tasks.filter(task => task.type === 'exercise' && task.completed);
  const calorieTask = tasks.find(task => task.type === 'calories');
  
  const totalDistance = exerciseTasks.reduce((sum, task) => sum + (task.data?.distance || 0), 0);
  const totalDuration = exerciseTasks.reduce((sum, task) => sum + (task.data?.duration || 0), 0);
  const totalCalories = calorieTask?.data?.calories || 0;

  const completedTasks = tasks.filter(task => task.completed);

  return (
    <div className="bg-white rounded-xl border border-stone-200 p-6 mb-8">
      <div className="flex items-center space-x-3 mb-6">
        <Calendar className="w-6 h-6 text-amber-600" />
        <h2 className="text-xl font-semibold text-stone-800">Daily Summary</h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="text-center p-4 bg-amber-50 rounded-lg">
          <Target className="w-6 h-6 text-amber-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-amber-700">{completionPercentage}%</div>
          <div className="text-sm text-amber-600">Completion Rate</div>
        </div>
        
        <div className="text-center p-4 bg-blue-50 rounded-lg">
          <Activity className="w-6 h-6 text-blue-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-blue-700">{totalDistance.toFixed(1)}</div>
          <div className="text-sm text-blue-600">Miles Traveled</div>
        </div>
        
        <div className="text-center p-4 bg-green-50 rounded-lg">
          <Activity className="w-6 h-6 text-green-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-green-700">{totalDuration}</div>
          <div className="text-sm text-green-600">Minutes Exercised</div>
        </div>
        
        <div className="text-center p-4 bg-orange-50 rounded-lg">
          <Apple className="w-6 h-6 text-orange-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-orange-700">{totalCalories}</div>
          <div className="text-sm text-orange-600">Calories Tracked</div>
        </div>
      </div>

      {completedTasks.length > 0 && (
        <div>
          <h3 className="font-semibold text-stone-800 mb-3">Completed Today:</h3>
          <div className="space-y-2">
            {completedTasks.map(task => (
              <div key={task.id} className="flex items-center space-x-3 p-2 bg-green-50 rounded-lg">
                <div className="text-green-600">{task.icon}</div>
                <span className="text-green-700 font-medium">{task.title}</span>
                {task.data && task.type === 'exercise' && (
                  <span className="text-sm text-green-600">
                    {task.data.distance > 0 && `${task.data.distance} mi`}
                    {task.data.distance > 0 && task.data.duration > 0 && ' • '}
                    {task.data.duration > 0 && `${task.data.duration} min`}
                  </span>
                )}
                {task.data && task.type === 'calories' && task.data.calories > 0 && (
                  <span className="text-sm text-green-600">{task.data.calories} cal</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
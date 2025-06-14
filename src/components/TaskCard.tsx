import React, { useState } from 'react';
import { Check, Clock, Target, Edit3 } from 'lucide-react';
import { DailyTask } from '../types';

interface TaskCardProps {
  task: DailyTask;
  onToggle: (id: string) => void;
  onUpdateData: (id: string, data: any) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onToggle, onUpdateData }) => {
  const [showInputs, setShowInputs] = useState(false);
  const [tempData, setTempData] = useState(task.data || {});

  const handleSaveData = () => {
    onUpdateData(task.id, tempData);
    setShowInputs(false);
  };

  const renderInputs = () => {
    if (task.type === 'exercise') {
      return (
        <div className="mt-3 p-3 bg-stone-50 rounded-lg space-y-2">
          <div className="flex space-x-2">
            <div className="flex-1">
              <label className="block text-xs font-medium text-stone-600 mb-1">
                Distance (miles)
              </label>
              <input
                type="number"
                step="0.1"
                value={tempData.distance || ''}
                onChange={(e) => setTempData(prev => ({ ...prev, distance: parseFloat(e.target.value) || 0 }))}
                className="w-full px-2 py-1 text-sm border border-stone-300 rounded focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="0.0"
              />
            </div>
            <div className="flex-1">
              <label className="block text-xs font-medium text-stone-600 mb-1">
                Duration (minutes)
              </label>
              <input
                type="number"
                value={tempData.duration || ''}
                onChange={(e) => setTempData(prev => ({ ...prev, duration: parseInt(e.target.value) || 0 }))}
                className="w-full px-2 py-1 text-sm border border-stone-300 rounded focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="0"
              />
            </div>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={handleSaveData}
              className="px-3 py-1 bg-amber-600 text-white text-xs rounded hover:bg-amber-700 transition-colors"
            >
              Save
            </button>
            <button
              onClick={() => setShowInputs(false)}
              className="px-3 py-1 bg-stone-300 text-stone-700 text-xs rounded hover:bg-stone-400 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      );
    }

    if (task.type === 'calories') {
      return (
        <div className="mt-3 p-3 bg-stone-50 rounded-lg space-y-2">
          <div>
            <label className="block text-xs font-medium text-stone-600 mb-1">
              Calories Consumed
            </label>
            <input
              type="number"
              value={tempData.calories || ''}
              onChange={(e) => setTempData(prev => ({ ...prev, calories: parseInt(e.target.value) || 0 }))}
              className="w-full px-2 py-1 text-sm border border-stone-300 rounded focus:outline-none focus:ring-2 focus:ring-amber-500"
              placeholder="0"
            />
          </div>
          <div className="flex space-x-2">
            <button
              onClick={handleSaveData}
              className="px-3 py-1 bg-amber-600 text-white text-xs rounded hover:bg-amber-700 transition-colors"
            >
              Save
            </button>
            <button
              onClick={() => setShowInputs(false)}
              className="px-3 py-1 bg-stone-300 text-stone-700 text-xs rounded hover:bg-stone-400 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      );
    }

    return null;
  };

  const renderDataDisplay = () => {
    if (task.type === 'exercise' && task.data) {
      const { distance = 0, duration = 0 } = task.data;
      if (distance > 0 || duration > 0) {
        return (
          <div className="flex items-center space-x-3 text-xs text-stone-600 mt-2">
            {distance > 0 && <span>{distance} miles</span>}
            {duration > 0 && <span>{duration} min</span>}
          </div>
        );
      }
    }

    if (task.type === 'calories' && task.data?.calories) {
      return (
        <div className="text-xs text-stone-600 mt-2">
          {task.data.calories} calories
        </div>
      );
    }

    return null;
  };

  return (
    <div
      className={`
        p-4 rounded-xl border-2 transition-all duration-300
        ${task.completed 
          ? 'bg-green-50 border-green-200 shadow-sm' 
          : 'bg-white border-amber-100 hover:border-amber-200 hover:shadow-md'
        }
      `}
    >
      <div className="flex items-start space-x-3">
        <div
          className={`
            w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 cursor-pointer
            ${task.completed 
              ? 'bg-green-500 border-green-500' 
              : 'border-amber-300 hover:border-amber-400'
            }
          `}
          onClick={() => onToggle(task.id)}
        >
          {task.completed && <Check className="w-4 h-4 text-white" />}
        </div>
        
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center space-x-2">
              {task.icon && <div className="text-amber-600">{task.icon}</div>}
              <h3 className={`font-medium ${task.completed ? 'text-green-700 line-through' : 'text-stone-800'}`}>
                {task.title}
              </h3>
            </div>
            
            {(task.type === 'exercise' || task.type === 'calories') && (
              <button
                onClick={() => setShowInputs(!showInputs)}
                className="p-1 text-stone-400 hover:text-amber-600 transition-colors"
              >
                <Edit3 className="w-4 h-4" />
              </button>
            )}
          </div>
          
          {task.description && (
            <p className="text-sm text-stone-600 mb-2">{task.description}</p>
          )}
          
          {task.timeTarget && (
            <div className="flex items-center space-x-1 text-xs text-amber-600">
              <Clock className="w-3 h-3" />
              <span>{task.timeTarget}</span>
            </div>
          )}

          {renderDataDisplay()}
          {showInputs && renderInputs()}
        </div>
      </div>
    </div>
  );
};
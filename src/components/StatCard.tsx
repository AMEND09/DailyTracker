import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  color?: 'orange' | 'green' | 'blue' | 'amber';
}

export const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  subtitle, 
  icon,
  color = 'orange' 
}) => {
  const colorClasses = {
    orange: 'bg-orange-100 text-orange-700',
    green: 'bg-green-100 text-green-700',
    blue: 'bg-blue-100 text-blue-700',
    amber: 'bg-amber-100 text-amber-700'
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-stone-200 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-stone-600">{title}</h3>
        {icon && (
          <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
            {icon}
          </div>
        )}
      </div>
      
      <div className="space-y-1">
        <p className="text-2xl font-bold text-stone-800">{value}</p>
        {subtitle && (
          <p className="text-xs text-stone-500">{subtitle}</p>
        )}
      </div>
    </div>
  );
};
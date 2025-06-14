import React from 'react';
import { Settings as SettingsIcon, Clock, Bell, Palette, Calendar } from 'lucide-react';
import { useSettings } from '../hooks/useSettings';

export const Settings: React.FC = () => {
  const { settings, updateSettings } = useSettings();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center space-x-3 mb-8">
        <SettingsIcon className="w-8 h-8 text-amber-600" />
        <h1 className="text-3xl font-bold text-stone-800">Settings</h1>
      </div>

      <div className="space-y-6">
        {/* Wake Up Time */}
        <div className="bg-white rounded-xl border border-stone-200 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Clock className="w-6 h-6 text-amber-600" />
            <h2 className="text-xl font-semibold text-stone-800">Wake Up Time</h2>
          </div>
          <div className="flex items-center space-x-4">
            <label className="text-stone-700">Target wake up time:</label>
            <input
              type="time"
              value={settings.wakeUpTime}
              onChange={(e) => updateSettings({ wakeUpTime: e.target.value })}
              className="px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-xl border border-stone-200 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Bell className="w-6 h-6 text-amber-600" />
            <h2 className="text-xl font-semibold text-stone-800">Notifications</h2>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-stone-800">Enable Notifications</div>
              <div className="text-sm text-stone-600">Get reminders for your daily tasks</div>
            </div>
            <button
              onClick={() => updateSettings({ notifications: !settings.notifications })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.notifications ? 'bg-amber-600' : 'bg-stone-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.notifications ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Theme */}
        <div className="bg-white rounded-xl border border-stone-200 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Palette className="w-6 h-6 text-amber-600" />
            <h2 className="text-xl font-semibold text-stone-800">Appearance</h2>
          </div>
          <div className="space-y-3">
            <div className="flex items-center space-x-4">
              <label className="text-stone-700">Theme:</label>
              <select
                value={settings.theme}
                onChange={(e) => updateSettings({ theme: e.target.value as 'light' | 'dark' })}
                className="px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
            </div>
          </div>
        </div>

        {/* Calendar */}
        <div className="bg-white rounded-xl border border-stone-200 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Calendar className="w-6 h-6 text-amber-600" />
            <h2 className="text-xl font-semibold text-stone-800">Calendar</h2>
          </div>
          <div className="flex items-center space-x-4">
            <label className="text-stone-700">Week starts on:</label>
            <select
              value={settings.weekStartsOn}
              onChange={(e) => updateSettings({ weekStartsOn: e.target.value as 'sunday' | 'monday' })}
              className="px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="sunday">Sunday</option>
              <option value="monday">Monday</option>
            </select>
          </div>
        </div>

        {/* Data Management */}
        <div className="bg-white rounded-xl border border-stone-200 p-6">
          <h2 className="text-xl font-semibold text-stone-800 mb-4">Data Management</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-200">
              <div>
                <div className="font-medium text-red-800">Clear All Data</div>
                <div className="text-sm text-red-600">This will permanently delete all your tasks, journal entries, and statistics</div>
              </div>
              <button
                onClick={() => {
                  if (confirm('Are you sure you want to clear all data? This cannot be undone.')) {
                    localStorage.clear();
                    window.location.reload();
                  }
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Clear Data
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
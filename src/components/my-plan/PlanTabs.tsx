'use client';

import { useState } from 'react';
import { useWorkout } from '@/context/WorkoutContext';
import PlannedCard from './PlannedCard';
import EmptyPlanState from './EmptyPlanState';
import { ChevronDown } from 'lucide-react';

export default function PlanTabs() {
  const { todayPlan, savedWorkouts } = useWorkout();
  const [activeTab, setActiveTab] = useState<'plan' | 'saved'>('plan');
  const [sortBy, setSortBy] = useState<'duration' | 'calories' | 'name'>('duration');

  const currentList = activeTab === 'plan' ? todayPlan : savedWorkouts;

  // Fully Safely Typed Sorting Array Logic
  const sortedList = [...(currentList || [])].sort((a, b) => {
    // Safely cast via unknown first to fix TS2352 conversion error
    const itemA = a as unknown as Record<string, unknown>;
    const itemB = b as unknown as Record<string, unknown>;

    // 1. Duration Sorting (High to Low)
    if (sortBy === 'duration') {
      const durationA = Number(a.durationMinutes || itemA.duration || 0);
      const durationB = Number(b.durationMinutes || itemB.duration || 0);
      return durationB - durationA;
    }

    // 2. Calories Sorting (High to Low)
    if (sortBy === 'calories') {
      const caloriesA = Number(a.caloriesBurned || itemA.calories || 0);
      const caloriesB = Number(b.caloriesBurned || itemB.calories || 0);
      return caloriesB - caloriesA;
    }

    // 3. Name / Title Alphabetical Sorting (A-Z)
    if (sortBy === 'name') {
      const nameA = (a.title || itemA.name || '').toString().toLowerCase();
      const nameB = (b.title || itemB.name || '').toString().toLowerCase();
      return nameA.localeCompare(nameB);
    }

    return 0;
  });

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        
        {/* Tabs */}
        <div className="bg-[#111622] p-1.5 rounded-2xl border border-gray-800/80 inline-flex items-center gap-1">
          <button
            onClick={() => setActiveTab('plan')}
            className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              activeTab === 'plan'
                ? 'bg-[#1A2130] text-white shadow-sm'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Today's Plan
          </button>
          <button
            onClick={() => setActiveTab('saved')}
            className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              activeTab === 'saved'
                ? 'bg-[#1A2130] text-white shadow-sm'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Saved
          </button>
        </div>

        {/* Dynamic Sort Dropdown */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <span className="text-xs font-medium text-gray-400">Sort By</span>
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'duration' | 'calories' | 'name')}
              className="appearance-none bg-[#111622] border border-gray-800/80 hover:border-gray-700 text-white text-xs font-semibold rounded-xl pl-4 pr-9 py-2.5 outline-none cursor-pointer transition"
            >
              <option value="duration">Duration</option>
              <option value="calories">Calories</option>
              <option value="name">Name</option>
            </select>
            <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

      </div>

      {/* Content Display */}
      {sortedList.length > 0 ? (
        <div className="space-y-3">
          {sortedList.map((workout) => (
            <PlannedCard
              key={workout.id}
              workout={workout}
              isSavedTab={activeTab === 'saved'}
            />
          ))}
        </div>
      ) : (
        <EmptyPlanState />
      )}
    </div>
  );
}
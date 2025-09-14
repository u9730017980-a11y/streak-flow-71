import { useState, useEffect } from 'react';

interface StreakData {
  streak: number;
  workDone: number;
  streakDone: boolean;
  lastUpdated: string;
}

const STORAGE_KEY = 'pomodoro-streak-data';

const getDefaultData = (): StreakData => ({
  streak: 0,
  workDone: 0,
  streakDone: false,
  lastUpdated: new Date().toDateString()
});

export const useStreakData = () => {
  const [data, setData] = useState<StreakData>(getDefaultData);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setData(parsed);
      } catch (error) {
        console.error('Error parsing streak data:', error);
        setData(getDefaultData());
      }
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  const getMinimumForDay = (dayOfWeek: string): number => {
    switch (dayOfWeek) {
      case 'Tuesday':
        return 0;
      case 'Friday':
        return 100;
      case 'Sunday':
        return 210;
      default:
        return 180;
    }
  };

  const updateStreak = () => {
    const now = new Date();
    const dayOfWeek = now.toLocaleDateString('en-US', { weekday: 'long' });
    const total = now.getHours() * 60 + now.getMinutes();
    const today = now.toDateString();
    
    setData(prevData => {
      let newData = { ...prevData };
      
      // Reset daily data if it's a new day
      if (prevData.lastUpdated !== today) {
        newData.workDone = 0;
        newData.streakDone = false;
        newData.lastUpdated = today;
      }

      const minimum = getMinimumForDay(dayOfWeek);

      // Reset streak_done at start of day (0-10 minutes)
      if (total >= 0 && total < 10 && newData.streakDone) {
        newData.streakDone = false;
        newData.workDone = 0;
      }

      // Check streak at end of day (23:49-23:59)
      if (total > 1429 && total < 1439 && !newData.streakDone) {
        if (newData.workDone >= minimum) {
          newData.streak += 1;
        } else {
          newData.streak = 0;
        }
        newData.streakDone = true;
      }

      return newData;
    });
  };

  const addWorkTime = (minutes: number) => {
    setData(prevData => ({
      ...prevData,
      workDone: prevData.workDone + minutes
    }));
  };

  const getCurrentDayMinimum = (): number => {
    const now = new Date();
    const dayOfWeek = now.toLocaleDateString('en-US', { weekday: 'long' });
    return getMinimumForDay(dayOfWeek);
  };

  return {
    data,
    updateStreak,
    addWorkTime,
    getCurrentDayMinimum
  };
};
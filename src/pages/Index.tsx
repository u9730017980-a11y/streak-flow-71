import { useState, useEffect } from "react";
import { PomodoroTimer } from "@/components/PomodoroTimer";
import { StreakDisplay } from "@/components/StreakDisplay";
import { ProgressBar } from "@/components/ProgressBar";
import { useStreakData } from "@/hooks/useStreakData";

const Index = () => {
  const [currentTime, setCurrentTime] = useState("");
  const { data, updateStreak, addWorkTime, getCurrentDayMinimum } = useStreakData();

  // Update current time every second
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('en-US', { 
        hour12: false,
        hour: '2-digit',
        minute: '2-digit'
      }));
    };

    updateTime();
    const timeInterval = setInterval(updateTime, 1000);
    return () => clearInterval(timeInterval);
  }, []);

  // Check streak every 5 minutes
  useEffect(() => {
    updateStreak(); // Initial check
    const streakInterval = setInterval(() => {
      updateStreak();
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(streakInterval);
  }, [updateStreak]);

  const handleSessionComplete = (duration: number) => {
    addWorkTime(duration);
  };

  const minimum = getCurrentDayMinimum();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-primary/5">
      <div className="container mx-auto px-4 py-8 space-y-8">
        <header className="text-center space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-dark to-primary-light bg-clip-text text-transparent">
            Productivity Streak Tracker
          </h1>
          <p className="text-muted-foreground">
            Stay consistent with your daily focus sessions
          </p>
        </header>

        <StreakDisplay 
          streak={data.streak}
          workDone={data.workDone}
          minimum={minimum}
          currentTime={currentTime}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <div className="bg-card rounded-lg p-6 shadow-lg border">
              <h3 className="text-lg font-semibold mb-4">Today's Progress</h3>
              <ProgressBar 
                current={data.workDone}
                target={minimum}
                label="Daily Work Requirement"
              />
            </div>
            
            <div className="bg-card rounded-lg p-6 shadow-lg border">
              <h3 className="text-lg font-semibold mb-4">Weekly Schedule</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Monday</span>
                  <span className="font-medium">180 minutes</span>
                </div>
                <div className="flex justify-between">
                  <span>Tuesday</span>
                  <span className="font-medium">0 minutes</span>
                </div>
                <div className="flex justify-between">
                  <span>Wednesday</span>
                  <span className="font-medium">180 minutes</span>
                </div>
                <div className="flex justify-between">
                  <span>Thursday</span>
                  <span className="font-medium">180 minutes</span>
                </div>
                <div className="flex justify-between">
                  <span>Friday</span>
                  <span className="font-medium">100 minutes</span>
                </div>
                <div className="flex justify-between">
                  <span>Saturday</span>
                  <span className="font-medium">180 minutes</span>
                </div>
                <div className="flex justify-between">
                  <span>Sunday</span>
                  <span className="font-medium">210 minutes</span>
                </div>
              </div>
            </div>
          </div>

          <PomodoroTimer onSessionComplete={handleSessionComplete} />
        </div>
      </div>
    </div>
  );
};

export default Index;

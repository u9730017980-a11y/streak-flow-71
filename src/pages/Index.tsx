import { useState, useEffect } from "react";
import { PomodoroTimer } from "@/components/PomodoroTimer";
import { StreakDisplay } from "@/components/StreakDisplay";
import { WeeklySchedule } from "@/components/WeeklySchedule";
import { useStreakData } from "@/hooks/useStreakData";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";

const Index = () => {
  const [currentTime, setCurrentTime] = useState("");
  const { data, updateStreak, addWorkTime, getCurrentDayMinimum } = useStreakData();
  const { theme, setTheme } = useTheme();

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
  }, []); // Remove updateStreak dependency to prevent infinite loop

  const handleSessionComplete = (duration: number) => {
    addWorkTime(duration);
  };

  const minimum = getCurrentDayMinimum();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-primary/5">
      <div className="container mx-auto px-4 py-8 space-y-8">
        <header className="text-center space-y-2 relative">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="absolute right-0 top-0"
          >
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
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
          <WeeklySchedule />
          <PomodoroTimer onSessionComplete={handleSessionComplete} />
        </div>
      </div>
    </div>
  );
};

export default Index;

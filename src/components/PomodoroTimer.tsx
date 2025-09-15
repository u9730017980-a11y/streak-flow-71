import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CircularProgress } from "./CircularProgress";

interface PomodoroTimerProps {
  onSessionComplete: (duration: number) => void;
}

export const PomodoroTimer = ({ onSessionComplete }: PomodoroTimerProps) => {
  const [duration, setDuration] = useState<string>("");
  const [block, setBlock] = useState<string>("");
  const [isRunning, setIsRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [currentPhase, setCurrentPhase] = useState<"focus" | "break" | "idle">("idle");
  const [sessionData, setSessionData] = useState<{
    focus: number;
    relax: number;
    focusTime: number;
    lastWindow: number;
  } | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            // Timer finished, handle phase transition
            handlePhaseComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const handlePhaseComplete = () => {
    if (currentPhase === "focus") {
      // Switch to break
      setCurrentPhase("break");
      setTimeLeft(5 * 60); // 5 minute break
    } else if (currentPhase === "break") {
      // Switch back to focus or end session
      setCurrentPhase("focus");
      setTimeLeft((sessionData?.focusTime || 25) * 60);
    }
  };

  const calculateSession = (durationMinutes: number, blockMinutes?: number) => {
    if (durationMinutes >= 40 && durationMinutes < 65) {
      const focusTime = (durationMinutes - 5) / 2;
      return {
        focus: 2,
        relax: 1,
        focusTime: focusTime,
        lastWindow: 0
      };
    } else if (durationMinutes >= 65 && blockMinutes) {
      let focus = 0;
      let relax = 0;
      let remaining = durationMinutes;
      let lastWindow = 0;
      let focusTime = blockMinutes;

      while (remaining >= blockMinutes + 5 + 10) {
        focus++;
        relax++;
        remaining -= blockMinutes + 5;
      }

      if (remaining >= blockMinutes + 5) {
        focus++;
        remaining -= blockMinutes;
      } else if (remaining >= 10) {
        lastWindow = remaining;
      } else {
        focusTime = blockMinutes + remaining / focus;
      }

      return { focus, relax, focusTime, lastWindow };
    } else {
      return {
        focus: 1,
        relax: 0,
        focusTime: durationMinutes,
        lastWindow: 0
      };
    }
  };

  const startSession = () => {
    const durationNum = parseInt(duration);
    const blockNum = block ? parseInt(block) : undefined;
    
    if (!durationNum || durationNum <= 0) return;

    const session = calculateSession(durationNum, blockNum);
    setSessionData(session);
    setTotalTime(session.focusTime * 60);
    setTimeLeft(session.focusTime * 60);
    setCurrentPhase("focus");
    setIsRunning(true);
  };

  const pauseSession = () => {
    setIsRunning(!isRunning);
  };

  const resetSession = () => {
    setIsRunning(false);
    setCurrentPhase("idle");
    setTimeLeft(0);
    setSessionData(null);
    setTotalTime(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = totalTime > 0 ? ((totalTime - timeLeft) / totalTime) * 100 : 0;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-center">Pomodoro Timer</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {!isRunning ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Duration (minutes)</label>
              <Input
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="Enter session duration"
              />
            </div>
            {parseInt(duration) >= 65 && (
              <div>
                <label className="block text-sm font-medium mb-2">Block size (minutes)</label>
                <Input
                  type="number"
                  value={block}
                  onChange={(e) => setBlock(e.target.value)}
                  placeholder="Enter focus block duration"
                />
              </div>
            )}
            <Button 
              onClick={startSession} 
              className="w-full"
              disabled={!duration || parseInt(duration) <= 0}
            >
              Start Session
            </Button>
          </div>
        ) : (
          <div className="text-center space-y-4">
            <CircularProgress percentage={progress} size={150}>
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">
                  {formatTime(timeLeft)}
                </div>
                <div className="text-sm text-muted-foreground capitalize">
                  {currentPhase}
                </div>
              </div>
            </CircularProgress>
            
            {sessionData && (
              <div className="text-sm text-muted-foreground space-y-1">
                <div>Focus windows: {sessionData.focus}</div>
                <div>Breaks: {sessionData.relax}</div>
                <div>Focus time: {sessionData.focusTime}min</div>
                {sessionData.lastWindow > 0 && (
                  <div>Last window: {sessionData.lastWindow}min</div>
                )}
              </div>
            )}
            
            <div className="flex gap-2">
              <Button 
                onClick={pauseSession} 
                variant="outline"
                className="flex-1"
              >
                {isRunning ? 'Pause' : 'Resume'}
              </Button>
              <Button 
                onClick={resetSession} 
                variant="destructive"
                className="flex-1"
              >
                Reset
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
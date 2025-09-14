import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CircularProgress } from "./CircularProgress";

interface StreakDisplayProps {
  streak: number;
  workDone: number;
  minimum: number;
  currentTime: string;
}

export const StreakDisplay = ({ streak, workDone, minimum, currentTime }: StreakDisplayProps) => {
  const progress = minimum > 0 ? Math.min((workDone / minimum) * 100, 100) : 100;
  const isGoalMet = workDone >= minimum;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Current Time Circle */}
      <Card className="text-center">
        <CardHeader>
          <CardTitle>Current Time</CardTitle>
        </CardHeader>
        <CardContent>
          <CircularProgress percentage={100} size={180}>
            <div className="text-center">
              <div className="text-3xl font-bold text-foreground">
                {currentTime}
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                {new Date().toLocaleDateString('en-US', { weekday: 'long' })}
              </div>
            </div>
          </CircularProgress>
        </CardContent>
      </Card>

      {/* Streak Counter */}
      <Card className="text-center">
        <CardHeader>
          <CardTitle>Current Streak</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-6xl font-bold bg-gradient-to-r from-primary-light to-primary-dark bg-clip-text text-transparent">
              {streak}
            </div>
            <div className="text-lg text-muted-foreground">
              {streak === 1 ? 'day' : 'days'}
            </div>
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              isGoalMet 
                ? 'bg-green-100 text-green-800' 
                : 'bg-orange-100 text-orange-800'
            }`}>
              {isGoalMet ? '✓ Goal achieved today' : '⏰ Work towards goal'}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
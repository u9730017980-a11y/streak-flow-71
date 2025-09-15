import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit2, Check, X } from "lucide-react";

interface Schedule {
  Monday: number;
  Tuesday: number;
  Wednesday: number;
  Thursday: number;
  Friday: number;
  Saturday: number;
  Sunday: number;
}

const defaultSchedule: Schedule = {
  Monday: 180,
  Tuesday: 0,
  Wednesday: 180,
  Thursday: 180,
  Friday: 100,
  Saturday: 180,
  Sunday: 210
};

export const WeeklySchedule = () => {
  const [schedule, setSchedule] = useState<Schedule>(defaultSchedule);
  const [isEditing, setIsEditing] = useState(false);
  const [tempSchedule, setTempSchedule] = useState<Schedule>(defaultSchedule);

  useEffect(() => {
    const saved = localStorage.getItem('weekly-schedule');
    if (saved) {
      try {
        setSchedule(JSON.parse(saved));
        setTempSchedule(JSON.parse(saved));
      } catch (error) {
        console.error('Error loading schedule:', error);
      }
    }
  }, []);

  const saveSchedule = () => {
    setSchedule(tempSchedule);
    localStorage.setItem('weekly-schedule', JSON.stringify(tempSchedule));
    setIsEditing(false);
  };

  const cancelEdit = () => {
    setTempSchedule(schedule);
    setIsEditing(false);
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins}m`;
    if (mins === 0) return `${hours}h`;
    return `${hours}h ${mins}m`;
  };

  const handleTimeChange = (day: keyof Schedule, value: string) => {
    const minutes = parseInt(value) || 0;
    setTempSchedule(prev => ({ ...prev, [day]: minutes }));
  };

  return (
    <Card className="bg-card rounded-lg shadow-lg border">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Weekly Schedule</CardTitle>
        {!isEditing ? (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditing(true)}
          >
            <Edit2 className="w-4 h-4 mr-2" />
            Edit
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={saveSchedule}
            >
              <Check className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={cancelEdit}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-sm">
          {Object.entries(isEditing ? tempSchedule : schedule).map(([day, minutes]) => (
            <div key={day} className="flex justify-between items-center">
              <span>{day}</span>
              {isEditing ? (
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    value={minutes}
                    onChange={(e) => handleTimeChange(day as keyof Schedule, e.target.value)}
                    className="w-20 h-8"
                    min="0"
                  />
                  <span className="text-xs text-muted-foreground">min</span>
                </div>
              ) : (
                <span className="font-medium">{formatTime(minutes)}</span>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
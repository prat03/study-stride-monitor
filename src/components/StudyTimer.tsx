import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, Square, Timer } from 'lucide-react';

interface StudySession {
  id: string;
  courseId: string;
  startTime: Date;
  endTime?: Date;
  duration: number; // in minutes
}

interface StudyTimerProps {
  courseId?: string;
  onSessionComplete?: (session: StudySession) => void;
}

export const StudyTimer = ({ courseId, onSessionComplete }: StudyTimerProps) => {
  const [isRunning, setIsRunning] = useState(false);
  const [time, setTime] = useState(0); // in seconds
  const [sessionStart, setSessionStart] = useState<Date | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning && sessionStart) {
      interval = setInterval(() => {
        setTime(Math.floor((Date.now() - sessionStart.getTime()) / 1000));
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, sessionStart]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStart = () => {
    setIsRunning(true);
    setSessionStart(new Date());
    setTime(0);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleStop = () => {
    if (sessionStart && time > 0) {
      const session: StudySession = {
        id: Date.now().toString(),
        courseId: courseId || 'general',
        startTime: sessionStart,
        endTime: new Date(),
        duration: Math.floor(time / 60)
      };
      
      onSessionComplete?.(session);
    }
    
    setIsRunning(false);
    setTime(0);
    setSessionStart(null);
  };

  const getTimerStatus = () => {
    if (isRunning) return 'active';
    if (time > 0) return 'paused';
    return 'stopped';
  };

  return (
    <Card className="shadow-soft">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Timer className="h-5 w-5 text-primary" />
          Study Timer
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <div className={`text-4xl font-bold font-mono ${
            isRunning ? 'text-primary animate-pulse-glow' : 'text-foreground'
          }`}>
            {formatTime(time)}
          </div>
          <Badge 
            variant={getTimerStatus() === 'active' ? 'default' : 'secondary'}
            className="mt-2"
          >
            {getTimerStatus() === 'active' && 'Recording'}
            {getTimerStatus() === 'paused' && 'Paused'}
            {getTimerStatus() === 'stopped' && 'Ready'}
          </Badge>
        </div>
        
        <div className="flex gap-2 justify-center">
          {!isRunning && time === 0 && (
            <Button 
              onClick={handleStart}
              className="bg-gradient-primary"
            >
              <Play className="h-4 w-4 mr-2" />
              Start Session
            </Button>
          )}
          
          {isRunning && (
            <Button 
              onClick={handlePause}
              variant="outline"
            >
              <Pause className="h-4 w-4 mr-2" />
              Pause
            </Button>
          )}
          
          {!isRunning && time > 0 && (
            <Button 
              onClick={handleStart}
              className="bg-gradient-primary"
            >
              <Play className="h-4 w-4 mr-2" />
              Resume
            </Button>
          )}
          
          {time > 0 && (
            <Button 
              onClick={handleStop}
              variant="outline"
              className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
            >
              <Square className="h-4 w-4 mr-2" />
              Stop & Save
            </Button>
          )}
        </div>
        
        {time > 0 && (
          <div className="text-sm text-muted-foreground text-center">
            Session duration: {Math.floor(time / 60)} minutes
          </div>
        )}
      </CardContent>
    </Card>
  );
};
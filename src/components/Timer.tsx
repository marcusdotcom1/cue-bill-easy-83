import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Play, Square, Clock } from 'lucide-react';

interface TimerProps {
  onTimeUpdate: (minutes: number) => void;
  onSessionStart: () => void;
  onSessionEnd: () => void;
  isActive: boolean;
  initialSeconds?: number;
}

export const Timer = ({ onTimeUpdate, onSessionStart, onSessionEnd, isActive, initialSeconds = 0 }: TimerProps) => {
  const [isRunning, setIsRunning] = useState(isActive);
  const [seconds, setSeconds] = useState(initialSeconds);

  // Use useCallback to prevent re-creation of onTimeUpdate causing render loops
  const stableTimeUpdate = useCallback((minutes: number) => {
    onTimeUpdate(minutes);
  }, [onTimeUpdate]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning) {
      interval = setInterval(() => {
        setSeconds(prev => {
          const newSeconds = prev + 1;
          const minutes = Math.floor(newSeconds / 60);
          // Use timeout to avoid updating parent during render
          setTimeout(() => stableTimeUpdate(minutes), 0);
          return newSeconds;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning, stableTimeUpdate]);

  // Sync with external state
  useEffect(() => {
    setIsRunning(isActive);
  }, [isActive]);

  useEffect(() => {
    setSeconds(initialSeconds);
  }, [initialSeconds]);

  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStart = () => {
    setIsRunning(true);
    onSessionStart();
  };

  const handleStop = () => {
    setIsRunning(false);
    onSessionEnd();
  };

  const handleReset = () => {
    setIsRunning(false);
    setSeconds(0);
    stableTimeUpdate(0);
  };

  return (
    <Card className="p-8 bg-card border-border shadow-[var(--shadow-elevation)]">
      <div className="text-center space-y-6">
        <div className="flex items-center justify-center gap-2 text-muted-foreground">
          <Clock className="w-6 h-6" />
          <span className="text-lg font-medium">Table Timer</span>
        </div>
        
        <div className="bg-felt-dark p-6 rounded-xl border border-border">
          <div className="text-6xl font-mono font-bold text-neon tracking-wider drop-shadow-[0_0_10px_hsl(var(--neon-green-glow))]">
            {formatTime(seconds)}
          </div>
        </div>

        <div className="flex gap-4 justify-center">
          {!isRunning ? (
            <Button
              onClick={handleStart}
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-xl font-bold shadow-[var(--shadow-neon)] hover:shadow-[var(--shadow-neon)] transition-all duration-300"
            >
              <Play className="w-8 h-8 mr-3" />
              Start Game
            </Button>
          ) : (
            <Button
              onClick={handleStop}
              size="lg"
              variant="destructive"
              className="px-8 py-6 text-xl font-bold shadow-[var(--shadow-elevation)] hover:shadow-[var(--shadow-elevation)] transition-all duration-300"
            >
              <Square className="w-8 h-8 mr-3" />
              Stop Game
            </Button>
          )}
          
          {seconds > 0 && (
            <Button
              onClick={handleReset}
              size="lg"
              variant="secondary"
              className="px-6 py-6 text-lg font-medium"
            >
              Reset
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};
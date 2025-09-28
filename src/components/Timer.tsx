import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Play, Square, Clock } from 'lucide-react';

interface TimerProps {
  onSessionStart: () => void;
  onSessionEnd: () => void;
  isActive: boolean;
  seconds: number;
}

export const Timer = ({ onSessionStart, onSessionEnd, isActive, seconds }: TimerProps) => {

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
    onSessionStart();
  };

  const handleStop = () => {
    onSessionEnd();
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
          {!isActive ? (
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
        </div>
      </div>
    </Card>
  );
};
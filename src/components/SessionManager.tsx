import { useState, useEffect } from 'react';
import { SessionData } from '@/components/SessionSummary';
import { CustomerData } from '@/components/CustomerInput';

interface ExtendedSessionData extends SessionData {
  customer?: CustomerData;
  tableNumber: number;
  sessionId: string;
  startTime?: Date;
  endTime?: Date;
  status: 'active' | 'completed' | 'paid' | 'unpaid';
  timerInterval?: NodeJS.Timeout;
  seconds: number;
}

// Global session state manager
class SessionManager {
  private sessions: Map<number, ExtendedSessionData> = new Map();
  private listeners: Set<() => void> = new Set();

  constructor() {
    // Initialize with empty sessions for tables 1-4
    for (let i = 1; i <= 4; i++) {
      this.sessions.set(i, {
        isActive: false,
        minutes: 0,
        tableCharges: 0,
        items: [],
        tableNumber: i,
        sessionId: Date.now().toString() + i,
        status: 'completed' as const,
        seconds: 0
      });
    }
  }

  getSession(tableNumber: number): ExtendedSessionData {
    return this.sessions.get(tableNumber) || this.createEmptySession(tableNumber);
  }

  updateSession(tableNumber: number, session: ExtendedSessionData) {
    this.sessions.set(tableNumber, session);
    this.notifyListeners();
  }

  getAllSessions(): ExtendedSessionData[] {
    return Array.from(this.sessions.values());
  }

  getCompletedSessions(): ExtendedSessionData[] {
    return Array.from(this.sessions.values()).filter(session => 
      session.status === 'completed' && session.customer?.name && session.minutes > 0
    );
  }

  addListener(listener: () => void) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener());
  }

  private createEmptySession(tableNumber: number): ExtendedSessionData {
    return {
      isActive: false,
      minutes: 0,
      tableCharges: 0,
      items: [],
      tableNumber,
      sessionId: Date.now().toString() + tableNumber,
      status: 'completed' as const,
      seconds: 0
    };
  }

  markSessionAsPaid(tableNumber: number) {
    const session = this.getSession(tableNumber);
    if (session) {
      this.updateSession(tableNumber, { ...session, status: 'paid' });
    }
  }

  resetSession(tableNumber: number) {
    const session = this.getSession(tableNumber);
    this.stopTimer(tableNumber);
    
    const newSession = {
      isActive: false,
      minutes: 0,
      tableCharges: 0,
      items: [],
      tableNumber,
      sessionId: Date.now().toString() + tableNumber,
      status: 'completed' as const,
      seconds: 0
    };
    this.updateSession(tableNumber, newSession);
  }

  startTimer(tableNumber: number) {
    const session = this.getSession(tableNumber);
    if (session.timerInterval) {
      clearInterval(session.timerInterval);
    }

    const interval = setInterval(() => {
      const currentSession = this.getSession(tableNumber);
      const newSeconds = currentSession.seconds + 1;
      const newMinutes = Math.floor(newSeconds / 60);
      
      // Calculate charges: 70 rupees for first 15 minutes, then 70 for each additional 15 minutes
      const tableCharges = newMinutes === 0 ? 70 : Math.ceil(newMinutes / 15) * 70;
      
      this.updateSession(tableNumber, {
        ...currentSession,
        seconds: newSeconds,
        minutes: newMinutes,
        tableCharges: tableCharges,
        isActive: true,
        startTime: currentSession.startTime || new Date()
      });
    }, 1000);

    this.updateSession(tableNumber, {
      ...session,
      timerInterval: interval,
      isActive: true,
      startTime: new Date(),
      tableCharges: 70 // Immediately charge 70 rupees when starting
    });
  }

  stopTimer(tableNumber: number) {
    const session = this.getSession(tableNumber);
    if (session.timerInterval) {
      clearInterval(session.timerInterval);
    }

    // Auto reset after stopping
    const newSession = {
      isActive: false,
      minutes: 0,
      tableCharges: 0,
      items: [],
      tableNumber,
      sessionId: Date.now().toString() + tableNumber,
      status: 'completed' as const,
      seconds: 0,
      endTime: new Date()
    };
    
    this.updateSession(tableNumber, newSession);
  }

  addItem(tableNumber: number, item: any) {
    const session = this.getSession(tableNumber);
    const existingItem = session.items.find(i => i.id === item.id);
    
    if (existingItem) {
      this.updateSession(tableNumber, {
        ...session,
        items: session.items.map(i => 
          i.id === item.id 
            ? { ...i, quantity: i.quantity + 1 }
            : i
        )
      });
    } else {
      this.updateSession(tableNumber, {
        ...session,
        items: [...session.items, { ...item, quantity: 1 }]
      });
    }
  }
}

// Singleton instance
export const sessionManager = new SessionManager();

// Hook to use session manager in components
export const useSessionManager = () => {
  const [, forceUpdate] = useState({});

  useEffect(() => {
    const unsubscribe = sessionManager.addListener(() => {
      forceUpdate({});
    });

    return unsubscribe;
  }, []);

  return sessionManager;
};

export type { ExtendedSessionData };
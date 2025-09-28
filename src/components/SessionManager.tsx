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
        status: 'completed' as const
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
      status: 'completed' as const
    };
  }

  markSessionAsPaid(tableNumber: number) {
    const session = this.getSession(tableNumber);
    if (session) {
      this.updateSession(tableNumber, { ...session, status: 'paid' });
    }
  }

  resetSession(tableNumber: number) {
    const newSession = {
      isActive: false,
      minutes: 0,
      tableCharges: 0,
      items: [],
      tableNumber,
      sessionId: Date.now().toString() + tableNumber,
      status: 'completed' as const
    };
    this.updateSession(tableNumber, newSession);
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
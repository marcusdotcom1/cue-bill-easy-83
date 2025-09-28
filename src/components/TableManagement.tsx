import { useState, useEffect } from 'react';
import { Timer } from '@/components/Timer';
import { ItemsBar, type Item } from '@/components/ItemsBar';
import { SessionSummary, type SessionData } from '@/components/SessionSummary';
import { BillModal } from '@/components/BillModal';
import { SessionEndModal } from '@/components/SessionEndModal';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { saveBillToStorage } from '@/utils/localStorage';

interface SessionState extends SessionData {
  startTime?: Date;
  endTime?: Date;
}

interface TableManagementProps {
  tableNumber: number;
}

export const TableManagement = ({ tableNumber }: TableManagementProps) => {
  const [session, setSession] = useState<SessionState>({
    isActive: false,
    minutes: 0,
    tableCharges: 0,
    items: [],
  });
  const [showBill, setShowBill] = useState(false);
  const [showSessionEndModal, setShowSessionEndModal] = useState(false);

  const handleTimeUpdate = (minutes: number) => {
    setSession(prev => ({
      ...prev,
      minutes,
      tableCharges: Math.ceil(minutes / 15) * 70
    }));
  };

  const handleSessionStart = () => {
    setSession(prev => ({ 
      ...prev, 
      isActive: true,
      startTime: new Date()
    }));
    toast({
      title: `Table ${tableNumber} Started! 🎱`,
      description: "Timer is now running. Game in progress!",
    });
  };

  const handleSessionEnd = () => {
    setSession(prev => ({ 
      ...prev, 
      isActive: false,
      endTime: new Date()
    }));
    
    // Show session end modal for customer details
    setShowSessionEndModal(true);
    
    toast({
      title: `Table ${tableNumber} Ended! ⏹️`,
      description: "Please enter customer details to complete the session.",
    });
  };

  const handleAddItem = (item: Item) => {
    const existingItem = session.items.find(i => i.id === item.id);
    
    setSession(prev => {
      if (existingItem) {
        return {
          ...prev,
          items: prev.items.map(i => 
            i.id === item.id 
              ? { ...i, quantity: i.quantity + 1 }
              : i
          )
        };
      } else {
        return {
          ...prev,
          items: [...prev.items, { ...item, quantity: 1 }]
        };
      }
    });
    
    toast({
      title: `${item.name} Added! 🛒`,
      description: `₹${item.price} added to Table ${tableNumber} bill.`,
    });
  };

  const handleGenerateBill = () => {
    setShowBill(true);
  };

  const handleCloseBill = () => {
    setShowBill(false);
    handleReset();
  };

  const handleSessionEndSubmit = (customerName: string, phone: string, paymentStatus: 'paid' | 'unpaid') => {
    // Save to localStorage
    const billData = saveBillToStorage({
      customerName,
      phone,
      tableNumber,
      duration: session.minutes,
      items: session.items,
      amount: session.tableCharges + session.items.reduce((sum, item) => sum + (item.price * item.quantity), 0),
      paymentStatus,
    });

    setShowSessionEndModal(false);
    
    toast({
      title: "Session Saved! 💾",
      description: `${customerName}'s session for Table ${tableNumber} has been recorded.`,
    });

    // Reset for next session
    handleReset();
  };

  const handleReset = () => {
    setSession({
      isActive: false,
      minutes: 0,
      tableCharges: 0,
      items: [],
    });
  };

  const getTableStatus = () => {
    if (session.isActive) return { label: 'Playing', color: 'bg-neon text-primary-foreground' };
    if (session.minutes > 0 && !session.isActive) return { label: 'Session Ended', color: 'bg-golden text-accent-foreground' };
    return { label: 'Available', color: 'bg-secondary text-secondary-foreground' };
  };

  const tableStatus = getTableStatus();

  return (
    <div className="space-y-6">
      {/* Table Header */}
      <Card className="p-6 bg-card border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-primary">{tableNumber}</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">Table {tableNumber}</h2>
              <p className="text-muted-foreground">Snooker Table Management</p>
            </div>
          </div>
          <Badge className={tableStatus.color}>
            {tableStatus.label}
          </Badge>
        </div>
      </Card>


      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Timer Section */}
        <div className="lg:col-span-2">
          <Timer
            onTimeUpdate={handleTimeUpdate}
            onSessionStart={handleSessionStart}
            onSessionEnd={handleSessionEnd}
            isActive={session.isActive}
            initialSeconds={session.minutes * 60}
          />
        </div>

        {/* Session Summary */}
        <div>
          <SessionSummary
            session={session}
            onGenerateBill={handleGenerateBill}
          />
        </div>
      </div>

      {/* Items Bar */}
      <ItemsBar onAddItem={handleAddItem} />

      {/* Session End Modal */}
      <SessionEndModal
        isOpen={showSessionEndModal}
        onClose={() => setShowSessionEndModal(false)}
        tableNumber={tableNumber}
        duration={session.minutes}
        items={session.items}
        tableCharges={session.tableCharges}
        onSubmit={handleSessionEndSubmit}
      />

      {/* Bill Modal */}
      <BillModal
        isOpen={showBill}
        onClose={handleCloseBill}
        session={session}
      />
    </div>
  );
};
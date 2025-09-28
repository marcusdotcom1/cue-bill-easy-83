import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Receipt, Clock, IndianRupee, ShoppingCart } from 'lucide-react';
import type { Item } from './ItemsBar';

interface SessionData {
  isActive: boolean;
  minutes: number;
  tableCharges: number;
  items: Array<Item & { quantity: number }>;
}

interface SessionSummaryProps {
  session: SessionData;
  onGenerateBill: () => void;
}

export const SessionSummary = ({ session, onGenerateBill }: SessionSummaryProps) => {
  const calculateTableCharges = (minutes: number) => {
    if (minutes === 0) return 0;
    const blocks = Math.ceil(minutes / 15);
    return blocks * 70;
  };

  const itemsTotal = session.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tableTotal = calculateTableCharges(session.minutes);
  const grandTotal = tableTotal + itemsTotal;

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  return (
    <Card className="p-6 bg-card border-border">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Receipt className="w-5 h-5 text-accent" />
          Current Session
        </h3>

        <div className="space-y-3">
          {/* Time & Table Charges */}
          <div className="flex items-center justify-between p-3 bg-felt-medium rounded-lg border border-border">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-neon" />
              <span className="text-sm font-medium">Time Played</span>
            </div>
            <div className="text-right">
              <div className="text-sm font-bold text-neon">{formatTime(session.minutes)}</div>
              <div className="text-xs text-muted-foreground">
                {session.minutes > 0 ? `${Math.ceil(session.minutes / 15)} blocks` : '0 blocks'}
              </div>
            </div>
          </div>

          {/* Table Charges */}
          <div className="flex items-center justify-between p-3 bg-felt-medium rounded-lg border border-border">
            <div className="flex items-center gap-2">
              <IndianRupee className="w-4 h-4 text-golden" />
              <span className="text-sm font-medium">Table Charges</span>
            </div>
            <div className="text-lg font-bold text-golden">₹{tableTotal}</div>
          </div>

          {/* Items */}
          {session.items.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <ShoppingCart className="w-4 h-4" />
                Items Ordered
              </div>
              {session.items.map((item, index) => (
                <div key={`${item.id}-${index}`} className="flex items-center justify-between p-2 bg-secondary/50 rounded border border-border/50">
                  <div className="flex items-center gap-2">
                    <div className="text-accent">{item.icon}</div>
                    <span className="text-sm">{item.name}</span>
                    <span className="text-xs text-muted-foreground">x{item.quantity}</span>
                  </div>
                  <div className="text-sm font-semibold text-golden">₹{item.price * item.quantity}</div>
                </div>
              ))}
            </div>
          )}

          {/* Total */}
          <div className="flex items-center justify-between p-4 bg-primary/10 rounded-lg border-2 border-primary/20">
            <span className="text-lg font-bold text-foreground">Total Amount</span>
            <div className="text-2xl font-bold text-primary">₹{grandTotal}</div>
          </div>
        </div>

        {!session.isActive && session.minutes > 0 && (
          <Button
            onClick={onGenerateBill}
            className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-bold py-3 shadow-[var(--shadow-golden)] hover:shadow-[var(--shadow-golden)] transition-all duration-300"
          >
            <Receipt className="w-5 h-5 mr-2" />
            Generate Bill
          </Button>
        )}
      </div>
    </Card>
  );
};

export type { SessionData };
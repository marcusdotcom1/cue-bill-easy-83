import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Share2, Printer, FileText, X, User } from 'lucide-react';
import type { SessionData } from './SessionSummary';

interface BillModalProps {
  isOpen: boolean;
  onClose: () => void;
  session: SessionData;
}

export const BillModal = ({ isOpen, onClose, session }: BillModalProps) => {
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

  const currentDateTime = new Date().toLocaleString('en-IN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });

  const handlePrint = () => {
    window.print();
  };

  const handleWhatsApp = () => {
    const billText = `
🎱 Rolling Stones - Snooker Hall

Bill Details:
Date: ${currentDateTime}
⏰ Time Played: ${formatTime(session.minutes)}
💰 Table Charges: ₹${tableTotal}

${session.items.length > 0 ? `🛒 Items:
${session.items.map(item => `• ${item.name} x${item.quantity} - ₹${item.price * item.quantity}`).join('\n')}

💰 Items Total: ₹${itemsTotal}` : ''}

💵 Grand Total: ₹${grandTotal}

Thank you for visiting Rolling Stones! 🎱
    `.trim();

    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(billText)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-card border-border">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-bold text-foreground">Bill Summary</DialogTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Header */}
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-primary">🎱 Rolling Stones</h2>
            <p className="text-sm text-muted-foreground">Snooker Hall</p>
            <p className="text-xs text-muted-foreground">{currentDateTime}</p>
          </div>

          <Separator className="bg-border" />

          {/* Session Details */}
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm">Time Played:</span>
              <span className="text-sm font-semibold text-neon">{formatTime(session.minutes)}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-sm">Table Charges:</span>
              <span className="text-sm font-semibold text-golden">₹{tableTotal}</span>
            </div>

            {session.items.length > 0 && (
              <>
                <Separator className="bg-border/50" />
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Items:</p>
                  {session.items.map((item, index) => (
                    <div key={`${item.id}-${index}`} className="flex justify-between text-sm">
                      <span>{item.name} x{item.quantity}</span>
                      <span className="font-semibold">₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                  <div className="flex justify-between text-sm font-medium pt-1 border-t border-border/50">
                    <span>Items Total:</span>
                    <span className="text-golden">₹{itemsTotal}</span>
                  </div>
                </div>
              </>
            )}
          </div>

          <Separator className="bg-border" />

          {/* Total */}
          <div className="flex justify-between items-center p-3 bg-primary/10 rounded-lg border border-primary/20">
            <span className="text-lg font-bold">Grand Total:</span>
            <span className="text-2xl font-bold text-primary">₹{grandTotal}</span>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3 pt-4">
            <Button
              onClick={handlePrint}
              variant="secondary"
              className="bg-secondary hover:bg-secondary/80"
            >
              <Printer className="w-4 h-4 mr-2" />
              Print
            </Button>
            <Button
              onClick={handleWhatsApp}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <Share2 className="w-4 h-4 mr-2" />
              WhatsApp
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
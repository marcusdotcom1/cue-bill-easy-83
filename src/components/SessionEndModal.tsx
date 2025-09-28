import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { User, Clock, IndianRupee, ShoppingCart } from 'lucide-react';
import { Item } from '@/components/ItemsBar';

interface SessionEndModalProps {
  isOpen: boolean;
  onClose: () => void;
  tableNumber: number;
  duration: number; // in minutes
  items: (Item & { quantity: number })[];
  tableCharges: number;
  onSubmit: (customerName: string, phone: string, paymentStatus: 'paid' | 'unpaid') => void;
}

export const SessionEndModal = ({ 
  isOpen, 
  onClose, 
  tableNumber, 
  duration, 
  items, 
  tableCharges, 
  onSubmit 
}: SessionEndModalProps) => {
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [paymentStatus, setPaymentStatus] = useState<'paid' | 'unpaid'>('unpaid');

  const itemsTotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const grandTotal = tableCharges + itemsTotal;

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const handleSubmit = () => {
    if (!customerName.trim()) return;
    onSubmit(customerName.trim(), phone.trim(), paymentStatus);
    setCustomerName('');
    setPhone('');
    setPaymentStatus('unpaid');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-center text-foreground">
            Session Complete - Table {tableNumber}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Session Summary */}
          <Card className="p-4 bg-secondary/20 border-border">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">Duration:</span>
                <span className="font-semibold text-foreground">{formatTime(duration)}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <IndianRupee className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">Table:</span>
                <span className="font-semibold text-foreground">₹{tableCharges}</span>
              </div>

              {items.length > 0 && (
                <>
                  <div className="col-span-2 flex items-center gap-2">
                    <ShoppingCart className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Items:</span>
                  </div>
                  <div className="col-span-2 space-y-1">
                    {items.map((item) => (
                      <div key={item.id} className="flex justify-between text-xs">
                        <span>{item.name} x{item.quantity}</span>
                        <span>₹{item.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}

              <div className="col-span-2 pt-2 border-t border-border">
                <div className="flex justify-between items-center text-lg font-bold">
                  <span className="text-foreground">Total:</span>
                  <span className="text-primary">₹{grandTotal}</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Customer Details */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="customerName" className="text-foreground">
                Customer Name *
              </Label>
              <Input
                id="customerName"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Enter customer name"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="phone" className="text-foreground">
                Phone Number (Optional)
              </Label>
              <Input
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter phone number"
                className="mt-1"
              />
            </div>

            {/* Payment Status */}
            <div>
              <Label className="text-foreground mb-2 block">Payment Status</Label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant={paymentStatus === 'unpaid' ? 'default' : 'outline'}
                  onClick={() => setPaymentStatus('unpaid')}
                  className="flex-1"
                >
                  Unpaid
                </Button>
                <Button
                  type="button"
                  variant={paymentStatus === 'paid' ? 'default' : 'outline'}
                  onClick={() => setPaymentStatus('paid')}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  Paid
                </Button>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!customerName.trim()}
              className="flex-1 bg-primary hover:bg-primary/90"
            >
              Save Session
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
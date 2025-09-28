import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { User, Phone } from 'lucide-react';

interface CustomerData {
  name: string;
  phone?: string;
}

interface CustomerInputProps {
  onCustomerSet: (customer: CustomerData) => void;
  customer?: CustomerData;
  disabled?: boolean;
  showRequired?: boolean;
}

export const CustomerInput = ({ onCustomerSet, customer, disabled, showRequired }: CustomerInputProps) => {
  const [name, setName] = useState(customer?.name || '');
  const [phone, setPhone] = useState(customer?.phone || '');
  const [isEditing, setIsEditing] = useState(!customer?.name);

  const handleSave = () => {
    if (name.trim()) {
      onCustomerSet({ name: name.trim(), phone: phone.trim() || undefined });
      setIsEditing(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  if (!isEditing && customer?.name) {
    return (
      <Card className="p-4 bg-card border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="font-semibold text-foreground">{customer.name}</p>
              {customer.phone && (
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <Phone className="w-3 h-3" />
                  {customer.phone}
                </p>
              )}
            </div>
          </div>
          {!disabled && (
            <Button onClick={handleEdit} variant="secondary" size="sm">
              Edit
            </Button>
          )}
        </div>
      </Card>
    );
  }

  return (
    <Card className={`p-4 bg-card border-border ${showRequired ? 'border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.3)]' : ''}`}>
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-foreground">
          <User className="w-5 h-5 text-primary" />
          <span className="font-medium">Customer Details</span>
          {showRequired && <span className="text-red-500 text-sm font-bold">(Required to complete session)</span>}
        </div>
        
        <div className="space-y-3">
          <div>
            <Label htmlFor="customer-name" className="text-sm font-medium">
              Customer Name *
            </Label>
            <Input
              id="customer-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter customer name"
              className="mt-1"
              disabled={disabled}
            />
          </div>
          
          <div>
            <Label htmlFor="customer-phone" className="text-sm font-medium">
              Phone Number (Optional)
            </Label>
            <Input
              id="customer-phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter phone number"
              className="mt-1"
              disabled={disabled}
            />
          </div>
          
          <div className="flex gap-2">
            <Button 
              onClick={handleSave} 
              disabled={!name.trim() || disabled}
              className="flex-1"
            >
              Save Customer
            </Button>
            {customer?.name && (
              <Button 
                onClick={() => setIsEditing(false)} 
                variant="secondary"
                disabled={disabled}
              >
                Cancel
              </Button>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export type { CustomerData };
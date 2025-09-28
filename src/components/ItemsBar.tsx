import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Coffee, Cigarette, Sandwich, Plus } from 'lucide-react';

interface Item {
  id: string;
  name: string;
  price: number;
  icon: React.ReactNode;
}

const quickItems: Item[] = [
  { id: 'cold-drink', name: 'Cold Drink', price: 25, icon: <Coffee className="w-6 h-6" /> },
  { id: 'cigarette', name: 'Cigarette', price: 15, icon: <Cigarette className="w-6 h-6" /> },
  { id: 'snacks', name: 'Snacks', price: 30, icon: <Sandwich className="w-6 h-6" /> },
];

interface ItemsBarProps {
  onAddItem: (item: Item) => void;
}

export const ItemsBar = ({ onAddItem }: ItemsBarProps) => {
  return (
    <Card className="p-6 bg-card border-border">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Plus className="w-5 h-5 text-accent" />
          Quick Add Items
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {quickItems.map((item) => (
            <Button
              key={item.id}
              onClick={() => onAddItem(item)}
              variant="secondary"
              className="h-16 flex-col gap-1 bg-secondary hover:bg-secondary/80 border border-border hover:border-accent/50 transition-all duration-200"
            >
              <div className="text-accent">{item.icon}</div>
              <div className="text-sm font-medium">{item.name}</div>
              <div className="text-xs text-golden font-bold">₹{item.price}</div>
            </Button>
          ))}
        </div>
      </div>
    </Card>
  );
};

export type { Item };
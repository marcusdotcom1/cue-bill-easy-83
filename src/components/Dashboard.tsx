import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart3, IndianRupee, Clock, Users, CheckCircle, XCircle, Eye } from 'lucide-react';
import { getBillsFromStorage, updateBillPaymentStatus, type BillData } from '@/utils/localStorage';
import { toast } from '@/hooks/use-toast';

export const Dashboard = () => {
  const [bills, setBills] = useState<BillData[]>([]);

  useEffect(() => {
    // Load bills from localStorage on component mount and refresh when component mounts
    const loadBills = () => setBills(getBillsFromStorage());
    loadBills();
    
    // Listen for storage changes from other tabs/components
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'snooker_bills') {
        loadBills();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Also check for updates every second to catch same-tab updates
    const interval = setInterval(loadBills, 1000);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const stats = {
    totalRevenue: bills.reduce((sum, bill) => sum + bill.amount, 0),
    paidAmount: bills
      .filter(bill => bill.paymentStatus === 'paid')
      .reduce((sum, bill) => sum + bill.amount, 0),
    unpaidAmount: bills
      .filter(bill => bill.paymentStatus === 'unpaid')
      .reduce((sum, bill) => sum + bill.amount, 0),
    totalSessions: bills.length,
    totalPlayTime: bills.reduce((sum, bill) => sum + bill.duration, 0),
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const formatDateTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const markAsPaid = (billId: string) => {
    const bill = bills.find(b => b.id === billId);
    if (bill) {
      updateBillPaymentStatus(billId, 'paid');
      setBills(prev => prev.map(b => 
        b.id === billId ? { ...b, paymentStatus: 'paid' } : b
      ));
      toast({
        title: "Payment Recorded! 💰",
        description: `Payment marked as received for ${bill.customerName}`,
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge className="bg-green-500 text-green-50"><CheckCircle className="w-3 h-3 mr-1" />Paid</Badge>;
      case 'unpaid':
        return <Badge className="bg-red-500 text-red-50"><XCircle className="w-3 h-3 mr-1" />Unpaid</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Overview and payment tracking</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6 bg-card border-border">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <IndianRupee className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Revenue</p>
              <p className="text-2xl font-bold text-foreground">₹{stats.totalRevenue}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-card border-border">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Paid Amount</p>
              <p className="text-2xl font-bold text-green-500">₹{stats.paidAmount}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-card border-border">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center">
              <XCircle className="w-6 h-6 text-red-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Unpaid Amount</p>
              <p className="text-2xl font-bold text-red-500">₹{stats.unpaidAmount}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-card border-border">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-neon/10 rounded-full flex items-center justify-center">
              <Clock className="w-6 h-6 text-neon" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Play Time</p>
              <p className="text-2xl font-bold text-neon">{formatTime(stats.totalPlayTime)}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Sessions Table */}
      <Card className="p-6 bg-card border-border">
        <Tabs defaultValue="all" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-accent" />
              Session History
            </h3>
            <TabsList>
              <TabsTrigger value="all">All Sessions</TabsTrigger>
              <TabsTrigger value="unpaid" className="text-red-500">Unpaid ({bills.filter(b => b.paymentStatus === 'unpaid').length})</TabsTrigger>
              <TabsTrigger value="paid" className="text-green-500">Paid ({bills.filter(b => b.paymentStatus === 'paid').length})</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="all">
            <SessionTable bills={bills} onMarkPaid={markAsPaid} />
          </TabsContent>
          <TabsContent value="unpaid">
            <SessionTable bills={bills.filter(b => b.paymentStatus === 'unpaid')} onMarkPaid={markAsPaid} />
          </TabsContent>
          <TabsContent value="paid">
            <SessionTable bills={bills.filter(b => b.paymentStatus === 'paid')} onMarkPaid={markAsPaid} />
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};

interface SessionTableProps {
  bills: BillData[];
  onMarkPaid: (billId: string) => void;
}

const SessionTable = ({ bills, onMarkPaid }: SessionTableProps) => {
  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const formatDateTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const getStatusBadge = (paymentStatus: 'paid' | 'unpaid') => {
    switch (paymentStatus) {
      case 'paid':
        return <Badge className="bg-green-500 text-green-50"><CheckCircle className="w-3 h-3 mr-1" />Paid</Badge>;
      case 'unpaid':
        return <Badge className="bg-red-500 text-red-50"><XCircle className="w-3 h-3 mr-1" />Unpaid</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      {bills.map((bill) => (
        <Card key={bill.id} className="p-4 bg-secondary/20 border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="font-bold text-primary">{bill.tableNumber}</span>
              </div>
              <div>
                <p className="font-semibold text-foreground">{bill.customerName}</p>
                {bill.phone && (
                  <p className="text-sm text-muted-foreground">{bill.phone}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  {formatDateTime(bill.timestamp)}
                </p>
                {bill.items.length > 0 && (
                  <p className="text-xs text-muted-foreground">
                    Items: {bill.items.map(item => `${item.name} x${item.quantity}`).join(', ')}
                  </p>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Time: {formatTime(bill.duration)}</p>
                <p className="text-lg font-bold text-foreground">₹{bill.amount}</p>
              </div>
              <div className="flex items-center gap-2">
                {getStatusBadge(bill.paymentStatus)}
                {bill.paymentStatus === 'unpaid' && (
                  <Button 
                    onClick={() => onMarkPaid(bill.id)}
                    size="sm"
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Mark Paid
                  </Button>
                )}
              </div>
            </div>
          </div>
        </Card>
      ))}
      
      {bills.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No sessions found</p>
        </div>
      )}
    </div>
  );
};
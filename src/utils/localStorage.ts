export interface BillData {
  id: string;
  customerName: string;
  phone?: string;
  tableNumber: number;
  duration: number; // in minutes
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
  }>;
  amount: number;
  paymentStatus: 'paid' | 'unpaid';
  timestamp: string;
}

const BILLS_STORAGE_KEY = 'snooker_bills';

export const saveBillToStorage = (billData: Omit<BillData, 'id' | 'timestamp'>): BillData => {
  const newBill: BillData = {
    ...billData,
    id: Date.now().toString(),
    timestamp: new Date().toISOString(),
  };

  const existingBills = getBillsFromStorage();
  const updatedBills = [...existingBills, newBill];
  
  localStorage.setItem(BILLS_STORAGE_KEY, JSON.stringify(updatedBills));
  return newBill;
};

export const getBillsFromStorage = (): BillData[] => {
  try {
    const bills = localStorage.getItem(BILLS_STORAGE_KEY);
    return bills ? JSON.parse(bills) : [];
  } catch (error) {
    console.error('Error reading bills from localStorage:', error);
    return [];
  }
};

export const updateBillPaymentStatus = (billId: string, paymentStatus: 'paid' | 'unpaid'): void => {
  const bills = getBillsFromStorage();
  const updatedBills = bills.map(bill => 
    bill.id === billId ? { ...bill, paymentStatus } : bill
  );
  
  localStorage.setItem(BILLS_STORAGE_KEY, JSON.stringify(updatedBills));
};

export const deleteBill = (billId: string): void => {
  const bills = getBillsFromStorage();
  const filteredBills = bills.filter(bill => bill.id !== billId);
  
  localStorage.setItem(BILLS_STORAGE_KEY, JSON.stringify(filteredBills));
};

export const clearAllBills = (): void => {
  localStorage.removeItem(BILLS_STORAGE_KEY);
};
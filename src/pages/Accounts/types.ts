export type Transaction = {
  id: number;
  amount: number;
  description: string | null;
  category: string | null;
  date: Date;
  payee: string | null;
  account: string;
  type: 'WITHDRAWAL' | 'DEPOSIT' | 'TRANSFER';
  tags: string[];
};

export enum AccountIconsNames {
  BANK = 'BANK',
  CARD = 'CARD',
  MONEY = 'MONEY',
  BILL = 'BILL',
  SAVINGS = 'SAVINGS',
  WALLET = 'WALLET',
  USD = 'USD',
  EUR = 'EUR',
  BTC = 'BTC',
  PAYMENTS = 'PAYMENTS',
  SHOPPING = 'SHOPPING',
  TRAVEL = 'TRAVEL',
}

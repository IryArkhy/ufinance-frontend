export type Account = {
  id: string;
  name: string;
  balance: number;
  currency: string;
  icon: string;
  isCredit: boolean;
};

export type Transaction = {
  id: number;
  amount: number;
  description: string | null;
  category: string | null;
  date: Date;
  payee: string | null;
  account: string;
  type: 'WITHDRAWAL' | 'DEPOSIT';
  tags: string[];
};

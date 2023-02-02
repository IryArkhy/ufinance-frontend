import AccountBalanceRoundedIcon from '@mui/icons-material/AccountBalanceRounded';
import AccountBalanceWalletRoundedIcon from '@mui/icons-material/AccountBalanceWalletRounded';
import AttachMoneyRoundedIcon from '@mui/icons-material/AttachMoneyRounded';
import CardTravelRoundedIcon from '@mui/icons-material/CardTravelRounded';
import CurrencyBitcoinRoundedIcon from '@mui/icons-material/CurrencyBitcoinRounded';
import EuroRoundedIcon from '@mui/icons-material/EuroRounded';
import MonetizationOnRoundedIcon from '@mui/icons-material/MonetizationOnRounded';
import MoneyRoundedIcon from '@mui/icons-material/MoneyRounded';
import PaymentRoundedIcon from '@mui/icons-material/PaymentRounded';
import PaymentsRoundedIcon from '@mui/icons-material/PaymentsRounded';
import SavingsRoundedIcon from '@mui/icons-material/SavingsRounded';
import ShoppingBasketRoundedIcon from '@mui/icons-material/ShoppingBasketRounded';

import { Account } from '../../lib/api/accounts';

import { AccountIconsNames } from './types';

export const ACCOUNT_ICONS = {
  [AccountIconsNames.BANK]: {
    Icon: AccountBalanceRoundedIcon,
    color: '#00425A',
  },
  [AccountIconsNames.CARD]: {
    Icon: PaymentRoundedIcon,
    color: '#F48484',
  },
  [AccountIconsNames.MONEY]: {
    Icon: MonetizationOnRoundedIcon,
    color: '#FC7300',
  },
  [AccountIconsNames.BILL]: {
    Icon: MoneyRoundedIcon,
    color: '#1F8A70',
  },
  [AccountIconsNames.SAVINGS]: {
    Icon: SavingsRoundedIcon,
    color: '#EBC7E6',
  },
  [AccountIconsNames.WALLET]: {
    Icon: AccountBalanceWalletRoundedIcon,
    color: '#BFDB38',
  },
  [AccountIconsNames.USD]: {
    Icon: AttachMoneyRoundedIcon,
    color: '#84D2C5',
  },
  [AccountIconsNames.EUR]: {
    Icon: EuroRoundedIcon,
    color: '#B05A7A',
  },
  [AccountIconsNames.BTC]: {
    Icon: CurrencyBitcoinRoundedIcon,
    color: '#FEBE8C',
  },
  [AccountIconsNames.PAYMENTS]: {
    Icon: PaymentsRoundedIcon,
    color: '#F7A4A4',
  },
  [AccountIconsNames.SHOPPING]: {
    Icon: ShoppingBasketRoundedIcon,
    color: '#E3ACF9',
  },
  [AccountIconsNames.TRAVEL]: {
    Icon: CardTravelRoundedIcon,
    color: '#FBC252',
  },
};

const CRYPTO_CURRENCY = ['BTC', 'ETH'];

export const groupAccountsByType = (
  accounts: Account[],
): { regular: Account[]; crypto: Account[] } => {
  const accountsByType = accounts.reduce(
    (accountTypes, acc) => {
      if (CRYPTO_CURRENCY.includes(acc.currency)) {
        accountTypes.crypto.push(acc);
      } else {
        accountTypes.regular.push(acc);
      }
      return accountTypes;
    },
    { crypto: [] as Account[], regular: [] as Account[] },
  );
  return accountsByType;
};

import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded';
import CompareArrowsRoundedIcon from '@mui/icons-material/CompareArrowsRounded';
import RemoveCircleOutlineRoundedIcon from '@mui/icons-material/RemoveCircleOutlineRounded';
import { Tooltip } from '@mui/material';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import React from 'react';

import { TransactionType } from '../../../lib/api/transactions';

interface TransactionTypeToggleBtnProps {
  value: TransactionType;
  onChange: (value: TransactionType) => void;
}
export function TransactionTypeToggleBtn({ value, onChange }: TransactionTypeToggleBtnProps) {
  const handleChange = (_: React.MouseEvent<HTMLElement>, value: TransactionType) => {
    onChange(value);
  };

  return (
    <ToggleButtonGroup
      value={value}
      exclusive
      onChange={handleChange}
      aria-label="transaction type"
      sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
    >
      <ToggleButton value="WITHDRAWAL" aria-label="left aligned">
        <Tooltip title="Withdraw">
          <RemoveCircleOutlineRoundedIcon />
        </Tooltip>
      </ToggleButton>
      <ToggleButton value="DEPOSIT" aria-label="centered">
        <Tooltip title="Deposit">
          <AddCircleOutlineRoundedIcon />
        </Tooltip>
      </ToggleButton>
      <ToggleButton value="TRANSFER" aria-label="right aligned">
        <Tooltip title="Transfer">
          <CompareArrowsRoundedIcon />
        </Tooltip>
      </ToggleButton>
    </ToggleButtonGroup>
  );
}

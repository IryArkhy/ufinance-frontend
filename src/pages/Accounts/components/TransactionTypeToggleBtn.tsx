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
  options: TransactionType[];
}
export function TransactionTypeToggleBtn({
  value,
  onChange,
  options,
}: TransactionTypeToggleBtnProps) {
  const handleChange = (_: React.MouseEvent<HTMLElement>, value: TransactionType) => {
    onChange(value);
  };

  const getIcon = (type: TransactionType) => {
    switch (type) {
      case 'DEPOSIT':
        return (
          <Tooltip title="Deposit">
            <AddCircleOutlineRoundedIcon />
          </Tooltip>
        );
      case 'WITHDRAWAL':
        return (
          <Tooltip title="Withdraw">
            <RemoveCircleOutlineRoundedIcon />
          </Tooltip>
        );

      default:
        return (
          <Tooltip title="Transfer">
            <CompareArrowsRoundedIcon />
          </Tooltip>
        );
    }
  };

  return (
    <ToggleButtonGroup
      value={value}
      exclusive
      onChange={handleChange}
      aria-label="transaction type"
      sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
    >
      {options.map((type) => (
        <ToggleButton key={type} value={type} aria-label="centered">
          {getIcon(type)}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
}

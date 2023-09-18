// ContextualToolbar.tsx
import React from 'react';
import { Button } from '@mui/material';
import { Data } from './DataTypes';

interface ContextualToolbarProps {
  selectedRows: Data[];  // You may need to import the Data type
}

export const ContextualToolbar: React.FC<ContextualToolbarProps> = ({ selectedRows }) => {
  const renderOptions = () => {
    if (selectedRows.some(row => row.type === 'file')) {
      return <Button color="primary">Open File</Button>;
    }
  };

  return <div className="contextual-toolbar">{renderOptions()}</div>;
};


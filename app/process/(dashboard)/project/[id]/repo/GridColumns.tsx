import React from 'react';
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid-pro';
import { StatusCell, ViewCell, DataCell } from './CellRenderers';

type HandleOpenModal = (params: GridRenderCellParams) => void;
type HandleOpenDataModal = (params: GridRenderCellParams) => void;

export const columns = (handleOpenModal: HandleOpenModal, handleOpenDataModal: HandleOpenDataModal): GridColDef[] => [
  { field: 'size', headerName: 'Size', width: 100 },
  { field: 'type', headerName: 'Type', width: 100 },
  {
    field: 'status',
    headerName: 'Status',
    width: 240,
    renderCell: (params) => <StatusCell params={params} />,
  },
  {
    field: 'view',
    headerName: 'View',
    width: 100,
    renderCell: (params) => <ViewCell params={params} handleOpenModal={handleOpenModal} />,
  },
  {
    field: 'data',
    headerName: 'Data',
    width: 100,
    renderCell: (params) => <DataCell params={params} handleOpenDataModal={handleOpenDataModal} />,
  },
  
  // ... more columns
];


import React, { FC } from 'react';
import { useViewAction } from '@/app/providers'; // context provider
import IconButton from '@mui/material/IconButton';
import TerminalIcon from '@mui/icons-material/Terminal';
import DataObjectIcon from '@mui/icons-material/DataObject';
import GitHubIcon from '@mui/icons-material/GitHub';
import DataObjectRoundedIcon from '@mui/icons-material/DataObjectRounded';
import { GridRenderCellParams } from '@mui/x-data-grid-pro';

interface StatusCellProps {
  params: GridRenderCellParams;
}

interface ViewCellProps extends StatusCellProps {
  handleOpenModal: (params: GridRenderCellParams) => void;
}

interface DataCellProps extends StatusCellProps {
  handleOpenDataModal: (params: GridRenderCellParams) => void;
}

const isButtonEnabled = (eid: number, workflowState: any) => {
  const stateObj = workflowState.find((state: any) => state.eid === eid);  
    return stateObj ? stateObj.eState : false;  
};

export const StatusCell: FC<StatusCellProps> = ({ params }) => (
  <strong>
    {params.value}
  </strong>
);

export const ViewCell: FC<ViewCellProps> = ({ params, handleOpenModal }) => (
  params.row.type === 'file' ? (
    <IconButton onClick={() => handleOpenModal(params)} color="primary">
      <GitHubIcon />
    </IconButton>
  ) : null
);

///////////////////////////////////////////////
//////   note this cell on action grid is   //
/////   for opening the data analysis grid //
////        the action card eid is 35      /
///////////////////////////////////////////

export const DataCell: FC<DataCellProps> = ({ params, handleOpenDataModal }) => {

  // context provider for the workflow
  const { actionSelected, workflowState, setWorkflowState } = useViewAction(); 
  
  const languageExtensions = ['.cbl', '.CBL'];
  const isCOBOLFile = languageExtensions.some(ext => params.row.name?.endsWith(ext));
 return isCOBOLFile ? (
    <IconButton onClick={() => handleOpenDataModal(params)} color="success" disabled={!isButtonEnabled(35, workflowState)}>
      <DataObjectIcon />
    </IconButton>
  ) : null
 }



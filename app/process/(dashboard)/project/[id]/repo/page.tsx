
"use client"

import { useState, useEffect, useCallback } from 'react';
import { useViewAction } from '@/app/providers'; // context provider

import { DataGridPro, LicenseInfo, GridToolbar, DataGridProProps } from '@mui/x-data-grid-pro';
import { Paper, Button, IconButton, Tooltip } from '@mui/material';
import { createTheme, ThemeProvider, useTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { faker } from '@faker-js/faker';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack'
import Box from '@mui/material/Box'
import data from './data.json'
import { Data } from './DataTypes'; 

import CameraIcon from "@mui/icons-material/Camera"
import AnalyzeIcon from "@mui/icons-material/Assessment"
import { ContextualToolbar } from './ContextualToolbar';
import { columns } from './GridColumns';
import { fetchData } from './dataFetchers';  // fetch repo and set status for action grid
import { detectLanguage } from './utils';  //

import CodeModal from "@/components/modalgrid/CodeModal"
import DataModal from "@/components/modalgrid/DataModal"
import RulePanelContent from "@/components/RulePanelContent"


// Create a dark theme instance
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});


export default function DataGrid() {
  const theme = useTheme();
  const [rows, setRows] = useState<Data[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDataModalOpen, setIsDataModalOpen] = useState(false);
  const [openModalData, setOpenModalData] = useState({name:'', hierarchy: []});
  const [modalData, setModalData] = useState<{ downloadUrl: string, language: string } | null>(null);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);

   // context provider for the workflow
   const { actionSelected, workflowState, setWorkflowState } = useViewAction();
  
  let key = process.env.MUI_LICENSE_KEY 

  if (key) {
    LicenseInfo.setLicenseKey(key);
  }

  // get the repo data and load the rows
  useEffect(() => {   
    fetchData(workflowState, setRows, setLoading);
  }, []);
 

const handleRowSelection = (newSelection: any) => {
    console.log(`----debugging row selection in main repo -----`)
    console.log(newSelection)
    setSelectedRows(newSelection);
  }

/////////////////////////////////////////////
//////   modal for viewing github file  ////
///////////////////////////////////////////
const handleOpenModal = (e: any) => {
  const downloadUrl = e.row.downloadurl;
  const language = detectLanguage(e.row.name);

  setModalData({ downloadUrl, language });
  setIsModalOpen(true);
}

const handleCloseModal = () => {
  setIsModalOpen(false);
  setModalData(null);
}

///////////////////////////////////////////////
/////   modal for viewing data analysis    ///
//// deep analysis of files and dependents //
////////////////////////////////////////////

const handleOpenDataModal = (e: any) => {
  console.log(`-----open data modal handle----`)
  console.log(e.row)
  setOpenModalData({name: e.row.name, hierarchy: e.row.hierarchy })
  setIsDataModalOpen(true);
}

const handleCloseDataModal = () => {
  setIsDataModalOpen(false);
  setModalData(null);
}

///// callback for detailed panel ////////

const getDetailPanelContent = useCallback<
    NonNullable<DataGridProProps['getDetailPanelContent']>
  >(({ row }) => <RulePanelContent programName={row.name}  />, []);

const getDetailPanelHeight = useCallback(() => 400, []);

///////////////////////////////////

const handleClickOpen = () => {
    setOpen(true);
  };

const handleClose = () => {
      setOpen(false);
  };

const handleConfirm = () => {
      // const filteredRows = rows.filter(row => row.application === searchTerm);
      // console.log(filteredRows);
      setOpen(false);
  };

const handleSearchTermChange = (event: any) => {
      setSearchTerm(event.target.value);
  };

const analyzeRows = async(rows: Data[]) => {
  const responses = []; // To store each row's response
  
  for (const row of rows) {
    const response = await fetch('/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(row),
    });
    const data = await response.json();
    responses.push(data);
  }
  
  // Log the final response
  console.log(responses);
}
  
// Function to handle the analyze icon click
const handleAnalyzeClick = () => {
    analyzeRows(rows);
}

  // temp function for build
  const handleAlert = () => {
    alert('Process is scheduled for execution ....')
  }

  const getTreeDataPath: DataGridProProps['getTreeDataPath'] = (row) =>
  row.hierarchy;

  return (
    <ThemeProvider theme={darkTheme}>
       <CssBaseline />
      <Paper > 
      <Tooltip title="Search Repo">
        <IconButton onClick={handleClickOpen} color="primary">
          <CameraIcon />
        </IconButton>
      </Tooltip>      
      
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Search</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Enter the application name to search for:
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Application Name"
            type="text"
            fullWidth
            value={searchTerm}
            onChange={handleSearchTermChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirm} color="primary">
            Search
          </Button>
        </DialogActions>
      </Dialog>
      {isModalOpen && modalData && (
        <CodeModal 
          downloadUrl={modalData.downloadUrl} 
          language={modalData.language} 
          onClose={handleCloseModal}
        />
      )}
      {isDataModalOpen && (
         <Box width="800px" height="500px">
            <DataModal           
              open={isDataModalOpen}
              onClose={handleCloseDataModal}
              selectedRow={openModalData.hierarchy}
            />
        </Box>
       
      )}
      
        <DataGridPro 
          rows={rows} 
          columns={columns(handleOpenModal, handleOpenDataModal)}
          slots={{
            toolbar: GridToolbar,
          }}
          pagination
          pageSizeOptions={[10]}       
          checkboxSelection
          density="compact"
          getRowId={(row) => row.id}
          treeData         
          getTreeDataPath={getTreeDataPath}
          rowThreshold={0}
          getDetailPanelHeight={getDetailPanelHeight}
          getDetailPanelContent={getDetailPanelContent}
          onRowSelectionModelChange={(newSelection) => handleRowSelection(newSelection)}
          loading={loading}
        />
      </Paper>
    </ThemeProvider>
  );
}



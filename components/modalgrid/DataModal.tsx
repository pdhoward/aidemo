
import React, { useEffect, useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from '@mui/material/Typography';
import DialogContent from '@mui/material/DialogContent';
import Box from '@mui/material/Box'
import { DataGridPro, GridColDef, GridToolbar} from '@mui/x-data-grid-pro';
import { work } from '@/styles/fonts';

interface DataProps {
  open: boolean;
  onClose: () => void;
  selectedRow: any[];
  //isDataAction: boolean   // was the data action card executed
  //isAIActive: boolean     // is AI toggle active
}

// types.ts
interface IRow {
    id: number;
    'Rule #': string;
    'Rule Name': string;
    'Rule Definition': string;
    'Data Element'?: string;
    'R/U'?: string;
    'Group #'?: string;
    'Record Name'?: string;
    'Dataset Name'?: string;    
  }
  

export default function DataModal({ open, onClose, selectedRow }: DataProps){
  const [rows, setRows] = useState<IRow[]>([]);
  const [pgmHeader, setPgmHeader] = useState('')
  const [ruleHeader, setRuleHeader] = useState('')
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null); 

  
  useEffect(() => {  
    
    setLoading(true);
    setError(null);
  
    const fetchData = async () => {
     
      let pgm = 'progam component not selected'
      try {
        
        if (selectedRow.length === 0) {
          setError('Please select a rule to process.');
        }

        if (Array.isArray(selectedRow) && selectedRow.length > 0) {
          pgm = selectedRow[2];          
        } else {
          setError('Please select a rule to process.');
        }  

        setRows([])
        setPgmHeader(pgm);
        
        ////////////////////////////////////////////////
        ///// temporary fix until data api deployed   //
        //// data only generated for 1 pgm for demo   /
        //////////////////////////////////////////////

        if (pgm != 'COACTUPC.cbl') {
          setError(`Data not yet generated for ${pgm}`)
          return
        }
        /////////////////////////////////////////////
        /////////////////////////////////////////////
        
        const res = await fetch('/api/fetchDataDependencyArray', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ pgm }),
        });
       
        if (!res.ok) setError('Failed to fetch data dependency array.');
        let response = await res.json();
        const processedRows = response.map((row: any, index: any) => ({ id: index, ...row }));
        setRows(processedRows);
        
      } catch (e: any) {
        
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData().catch(e => {      
      setError(e.message);
    }).finally(() => {        
      setLoading(false);
    });
  }, [open, selectedRow]);

  const columns: GridColDef[] = [
    { field: 'Rule #', headerName: 'Rule', width: 60 },
    { field: 'Rule Name', headerName: 'Rule Name', width: 120 },
    { field: 'Rule Definition', headerName: 'Definition', width: 180 },
    { field: 'Data Element', headerName: 'Element', width: 180 },
    { field: 'R/U', headerName: 'R/U', width: 25 },
    { field: 'Group #', headerName: 'GRP #', width: 25 },
    { field: 'Record Name', headerName: 'Record Name', width: 180 },
    { field: 'Dataset Name', headerName: 'Dataset Name', width: 180 },
  ];

  return (    
    <Box >        
      <Dialog open={open} onClose={onClose} maxWidth="xl">
        <DialogTitle id="form-dialog-title">
          <Typography className="text-xs">
            {`Business Rules, Data Dependencies and Affinity Analysis for ${pgmHeader} `}
          </Typography>         
        </DialogTitle>
        <DialogContent >
        {error && <p className="text-red-500">{error}</p>}
        {open && (
           <div style={{ width: '1000px', height: '500px' }}>
          <DataGridPro           
            density="compact"
            rows={rows} 
            columns={columns}
            slots={{
              toolbar: GridToolbar,
            }}
            pagination
            pageSizeOptions={[10]}             
            getRowId={(row) => row.id}             
            loading={loading}        
          />
          </div>
        )}
        </DialogContent>
      </Dialog>
    </Box>    
  );
};



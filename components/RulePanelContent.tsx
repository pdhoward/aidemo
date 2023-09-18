
import { useState, useEffect } from 'react';
import { useViewAction } from '@/app/providers'; // context provider

import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';

import { Paper, Button, IconButton, Tooltip } from '@mui/material';

import DesignServicesIcon from '@mui/icons-material/DesignServices';
import SmsIcon from '@mui/icons-material/Sms';
import SupervisedUserCircleIcon from '@mui/icons-material/SupervisedUserCircle';
import CodeIcon from '@mui/icons-material/Code';
import QuizIcon from '@mui/icons-material/Quiz';
import BugReportIcon from '@mui/icons-material/BugReport';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ToggleOnIcon from '@mui/icons-material/ToggleOn';
import ToggleOffIcon from '@mui/icons-material/ToggleOff';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

import { DataGridPro, DataGridProProps, GridColDef } from '@mui/x-data-grid-pro';
import TranslateModal from '@/components/modalgrid/TranslateModal'
import COBOLModal from '@/components/modalgrid/COBOLModal'
import TransformModal from '@/components/modalgrid/TransformModal'
import DeploymentModal from '@/components/modalgrid/DeploymentModal'
import { red, blue, grey } from '@mui/material/colors';

interface RuleModalProps {  
    programName: string | null; // name of the program. 
  }
// Define your types
interface Child {
    component: string;
    name: string;
    type: string;
  }
  
  interface ProgramData {
    component: string;
    type: string;
    name: string;
    children?: Child[];
  }

  // WorkflowStateObject type definition
type WorkflowStateObject = {
  eid: number;
  pre: number[];
  eState: boolean;
  dState: boolean;
  isExecuting: boolean;
  name: string;
  description: string;
  api: string;
  image: string;
};

export default function RulePanelContent({ programName }: RuleModalProps) {
   const [programData, setProgramData] = useState<ProgramData | null>(null);
   const [error, setError] = useState<string | null>(null);
   const [isTranslateModalOpen, setIsTranslateModalOpen] = useState(false);
   const [isCOBOLModalOpen, setIsCOBOLModalOpen] = useState(false);
   const [isTransformModalOpen, setIsTransformModalOpen] = useState(false);   
   const [isDeploymentModalOpen, setIsDeploymentModalOpen] = useState(false); 
   const [isAIActive, setIsAIActive] = useState(false);
   const [selectedRows, setSelectedRows] = useState<any[]>([]);
   const [selectedComponent, setSelectedComponent] = useState<any>('');
   const [isLanguageDialogOpen, setIsLanguageDialogOpen] = useState(false);
   const [selectedLanguage, setSelectedLanguage] = useState("");
   const [resolveLanguageChoice, setResolveLanguageChoice] = useState<(value: string | PromiseLike<string>) => void>();

    // context provider for the workflow
    const { actionSelected, workflowState, setWorkflowState } = useViewAction();   

   // Function to open language selection dialog and return a Promise
    const openLanguageSelectionDialog = () => {
      return new Promise<string>((resolve, reject) => {
        setIsLanguageDialogOpen(true);
        setResolveLanguageChoice(() => resolve);
      });
    };

    // Function to handle language dialog close
    const handleLanguageClose = (choice: string) => {
      setIsLanguageDialogOpen(false);
      resolveLanguageChoice && resolveLanguageChoice(choice);
    };

    const handleAlert = () => {
      alert('Button clicked');
    };

    // Function to handle translate modal open
    const handleTranslateModalOpen = () => {      
      if (selectedRows.length > 0) {        
        setIsTranslateModalOpen(true);
      } else {
        alert('Select a set of rules to process')
      }
    }
    // Function to handle chat modal open
    const handleCOBOLModalOpen = () => {
     
      if (selectedRows.length > 0) {        
        setIsCOBOLModalOpen(true);
      } else {
        alert('Select a rule to fetch the code')
      }
    }

// Function to handle transform modal open
    const handleTransformModalOpen = async (comp: string) => {      
      if (selectedRows.length > 0) {    
        if (comp === 'CODE') {
          // Open language selection dialog and wait for the user to make a choice
          const programminglanguage = await openLanguageSelectionDialog();          
          // pass the selected language
          setSelectedComponent(programminglanguage);
        } else {
          setSelectedComponent(comp);
        }
    
        setIsTransformModalOpen(true);
      } else {
        alert('Select a set of rules to process')
      }
    }

    // Function to handle deployment modal open
    const handleDeploymentModalOpen = (lpatform: string) => {
     
      if (selectedRows.length > 0) {        
        setIsDeploymentModalOpen(true);
      } else {
        alert('Select a rule to deploy')
      }
    }
  // Function to handle translate modal close
  const handleTranslateModalClose = () => {
    setIsTranslateModalOpen(false);
  }
  // Function to handle cobol modal close
  const handleCOBOLModalClose = () => {
    setIsCOBOLModalOpen(false);
  }

  // Function to handle transform modal close
  const handleTransformModalClose = () => {
    setIsTransformModalOpen(false);
  }

  // Function to handle deployment modal close
  const handleDeploymentModalClose = () => {
    setIsDeploymentModalOpen(false);
  }


  const isButtonEnabled = (eid: number, parentId?: number) => {
    const findState = (id: number) => workflowState.find(state => state.eid === id);
      
    if (parentId !== undefined) {      
      const parentState = findState(parentId);
     
      if (!parentState || !parentState.eState) {
        return false;
      }
      else {
        return parentState ? parentState.eState : false;
      }
    }  
   
  };

  const renderWorkflowButtons = () => {
    const buttonConfig = [
      { eid: 25, title: "Business Rules: Extract Code for Rule", icon: DesignServicesIcon, onClick: () => handleCOBOLModalOpen(),  parentId: 10 },
      { eid: 40, title: "Natural Language: Translate Rule to NL", icon: SmsIcon, onClick: () => handleTranslateModalOpen(), parentId: 40 },
      { eid: 50, title: "Generate Agile Story", icon: SupervisedUserCircleIcon, onClick: () => handleTransformModalOpen('AGILE'), parentId: 50 },        
      { eid: 60, title: "Generate Code", icon: CodeIcon, onClick: () => handleTransformModalOpen('CODE'), parentId: 60 },
      { eid: 70, title: "Test Services: Create Strategy", icon: QuizIcon, onClick: () => handleTransformModalOpen('TESTSTRATEGY'), parentId: 65 },
      { eid: 80, title: "Test Services: Generate Test Case", icon: BugReportIcon, onClick: () => handleTransformModalOpen('TESTCASE'), parentId: 65  },
      { eid: 90, title: "Deploy Application", icon: CloudUploadIcon, onClick: () => handleDeploymentModalOpen('AWS'), parentId: 90 },
    ];

    return (
      <>
      {buttonConfig.map(({ eid, title, icon: IconComponent, onClick, parentId }) => (
        <Tooltip key={eid} title={title}>
          <span>
            <IconButton onClick={onClick} color="primary" disabled={!isButtonEnabled(eid, parentId)}>
              <IconComponent />
            </IconButton>
          </span>
        </Tooltip>
      ))}
      <Tooltip key={1000} title={'Activate AI'}>
          <span>
            <IconButton
                sx={{
                  color: isAIActive ? blue[600] : red[800],
                }}
                onClick={() => setIsAIActive(!isAIActive)}
              >
                {isAIActive ? <ToggleOnIcon /> : <ToggleOffIcon />}
            </IconButton>
          </span>
        </Tooltip>
      </>
      
    )
    
  };  

    // function to capture row ids upon selection
    const handleSelectionModelChange = (newSelection: any[]) => {
      // `newSelection` will contain the `id` of selected rows
      // Assuming `rows` is the state or computed rows you are using to populate the DataGridPro
      const selectedRows = newSelection.map(id => rows.find(row => row.id === id)).filter(Boolean);
      setSelectedRows(selectedRows);
    };
 
    useEffect(() => {

        if (!programName) return; // Skip if programName is not set

        if (programName) {
          // Using POST request
          fetch('/api/fetchRuleTags', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name: programName }),
          })
          .then((res) => res.json())
          .then((data) => {            
            setProgramData(data);
          })
          .catch((error) => {
            console.error('Error:', error)
            setError('Failed to fetch data.');
          });
          
        }
      }, [programName]);
    
      const flattenChildren = (children: any, parentId: any, parentHierarchy: string[] = []) => {
        let rows: any[] = [];
        children.forEach((child: any, index: any) => {
          const { name, ...restOfChild } = child; // Destructure child to separate name from rest
          const id = parentId ? `${parentId}.${index}` : `${index}`;
          const hierarchy = [...parentHierarchy, name];
          rows.push({
            id,
            hierarchy,
            ...restOfChild,
          });
          if (child.children) {
            rows = rows.concat(flattenChildren(child.children, id, hierarchy));
          }
        });
        return rows;
    };

  const columns = [    
    { field: 'component', headerName: 'Component', width: 200 },   
    { field: 'type', headerName: 'Type', width: 200 },
  ];
  
  // Prepare rows based on the shape and depth of JSON
  let rows: any[] = [];
  if (programData) {
    // Add the root level PGM component itself
    rows.push({
      id: 'root',
      component: programData.component,
      type: programData.type,     
      hierarchy: [programData.name]
    });
    
    // Add children
    if (programData.children) {
      rows = rows.concat(flattenChildren(programData.children, 'root', [programData.name]));
    }
  }
  const getTreeDataPath: DataGridProProps['getTreeDataPath'] = (row) =>  row.hierarchy;

  return (   
        <Stack
          sx={{ py: 2, height: '100%', boxSizing: 'border-box' }}
          direction="column"
        >
          <Paper sx={{ flex: 1, mx: 'auto', width: '90%', p: 1 }}>
            <Stack direction="column" spacing={1} sx={{ height: 1 }}>
              <Typography variant="h6">{`Program: ${programName}`}</Typography>
              <Grid container>
                <Grid item md={6}>
                  <Typography variant="body2" color="textSecondary">
                    Altitude80 AI Modernization Workbench
                  </Typography>                  
                </Grid>               
              </Grid>              
              <div>
                {renderWorkflowButtons()}
              </div>
              {isTranslateModalOpen && (
                  <TranslateModal
                    open={isTranslateModalOpen}
                    onClose={handleTranslateModalClose}
                    selectedRows={selectedRows} // Pass selected rows to ChatModal
                    selectedAction={'OPENAI'}
                    selectedComponent={"NATURAL"}
                    isAIActive={isAIActive}
                  />
              )}
              {isCOBOLModalOpen && (
                  <COBOLModal
                    open={isCOBOLModalOpen}
                    onClose={handleCOBOLModalClose}
                    selectedRows={selectedRows} // Pass selected rows to ChatModal
                  />
              )}
              {isTransformModalOpen && (
                  <TransformModal
                    open={isTransformModalOpen}
                    onClose={handleTransformModalClose}
                    selectedRows={selectedRows} // Pass selected rows to ChatModal
                    selectedAction={'OPENAI'}
                    selectedComponent={selectedComponent}
                    isAIActive={isAIActive}
                  />
              )}
               {isDeploymentModalOpen && (
                  <DeploymentModal
                    open={isDeploymentModalOpen}
                    onClose={handleDeploymentModalClose}
                    selectedRows={selectedRows} // Pass selected rows to ChatModal
                    selectedAction={'OPENAI'}      
                    isAIActive={isAIActive}           
                  />
              )}
               <Dialog open={isLanguageDialogOpen} onClose={() => handleLanguageClose(selectedLanguage)}>
                <DialogTitle>Select a Programming Language</DialogTitle>
                <DialogContent>
                  <DialogContentText>
                    Please select a programming language from the list below.
                  </DialogContentText>
                  <Select
                    value={selectedLanguage}
                    onChange={(e) => setSelectedLanguage(e.target.value as string)}
                  >
                    <MenuItem value={"python"}>Python</MenuItem>                    
                    <MenuItem value={"java"}>Java</MenuItem>
                    {/* Add more MenuItem components here for additional languages */}
                  </Select>
                </DialogContent>
                <DialogActions>
                  <Button onClick={() => handleLanguageClose("")} color="primary">
                    Cancel
                  </Button>
                  <Button 
                    onClick={() => handleLanguageClose(selectedLanguage)} 
                    color="primary"
                  >
                    Confirm
                  </Button>
                </DialogActions>
              </Dialog>
              {error && <p className="text-red-500">{error}</p>}
              {programData && (
                    <div className="h-[400px] w-full">
                    <DataGridPro 
                        density="compact"
                        rows={rows} 
                        columns={columns} 
                        checkboxSelection
                        getRowId={(row) => row.id}
                        treeData      
                        getTreeDataPath={getTreeDataPath}
                        sx={{ flex: 1 }}
                        hideFooter
                        onRowSelectionModelChange={(newSelection) => handleSelectionModelChange(newSelection)}
                        defaultGroupingExpansionDepth={-1}
                    />
                    </div>
                )}             
            </Stack>
          </Paper>
        </Stack>
  );
}


import { Octokit } from "@octokit/rest";
import { nanoid } from 'nanoid'
import { IconButton, Tooltip } from '@mui/material';
import AnalyzeIcon from '@mui/icons-material/Topic';
import SmsIcon from '@mui/icons-material/Sms';
import SupervisedUserCircleIcon from '@mui/icons-material/SupervisedUserCircle';
import CodeIcon from '@mui/icons-material/Code';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import AddTaskIcon from '@mui/icons-material/AddTask';

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
  userAgent: 'myApp v1.2.3',
  // Other configurations if needed
});

type ContentType = "file" | "dir" | "symlink" | "submodule";

interface GithubRepoContent {
  type: ContentType;
  size: number;
  name: string;
  path: string;
  sha: string;
  url: string;
  git_url: string | null;
  html_url: string | null;
  download_url?: string | null;
  hierarchy?: string[]
  // ... other fields ...
}

const specialFiles = [
  'CODE_OF_CONDUCT.md', 
  '.gitkeep', 
  'CONTRIBUTING.md', 
  'LICENSE', 
  'NOTICE', 
  'README.md', 
  '.gitignore',
  'Admin-Menu.png',
  'Application-Flow-Admin.png',
  'Application-Flow-User.png',
  'CARDDEMO-DataModel.drawio',
  'Main-Menu.png',
  'Signon-Screen.png',
  'LISTCAT.txt'];

const specialExtensions = [
  '.md', 
  '.txt', 
  '.png', 
  '.jpg', 
  '.drawio', 
  '.PS', 
  '.INIT', 
  '.zip'];
  const handleAlert = () => {
    alert(`Contact your project leader for additional info`)
  }

  const isButtonEnabled = (eid: number, workflowState: any) => {
    const stateObj = workflowState.find((state: any) => state.eid === eid);
    if (eid == 20) {
      return true
    } else {
      return stateObj ? stateObj.eState : false;
    }
  };

  const renderWorkflowButtons = (workflowState: any) => {
    const buttonConfig = [
      { eid: 10, title: "Business Rules Analysis", icon: AnalyzeIcon, onClick: () => handleAlert()  },     
      { eid: 40, title: "Generate Natural Language", icon: SmsIcon, onClick: () => handleAlert() },
      { eid: 50, title: "Generate Agile Stories", icon: SupervisedUserCircleIcon, onClick: () => handleAlert() },        
      { eid: 60, title: "Generate Code", icon: CodeIcon, onClick: () => handleAlert() },
      { eid: 65, title: "Test Services", icon: AddTaskIcon, onClick: () => handleAlert() },     
      { eid: 90, title: "Deploy Application", icon: CloudUploadIcon, onClick: () => handleAlert() },
    ];

    return buttonConfig.map(({ eid, title, icon: IconComponent, onClick }) => (
      <Tooltip key={eid} title={title}>
        <span>
          <IconButton onClick={onClick} color="success" disabled={!isButtonEnabled(eid, workflowState)}>
            <IconComponent />
          </IconButton>
        </span>
      </Tooltip>
    ));

  };  

export const getRepoContents = async(owner: any, repo: any, path = "") => {
    try {
      const response = await octokit.repos.getContent({ owner, repo, path });  
      const data: GithubRepoContent[] = Array.isArray(response.data) ? response.data : [response.data];
    
      let contents: GithubRepoContent[] = [];
    
      for (const item of data) {
        if (item.type === 'dir') {
          const subContents = await getRepoContents(owner, repo, item.path);
          contents = contents.concat(subContents);
        } else {
           // Add hierarchy property here based on the path for MUI datagrid
           item.hierarchy = item.path.split('/').filter(Boolean);
          contents.push(item);
        }
      }
      return contents;
    } catch (error: any) {
      console.error(`Error fetching repo contents: ${error.message}`);
      return [];
    } 
  }

//////////////////////////////////
//// fetch the repo contents ////
/// load the action grid     ///
///////////////////////////////

export const fetchData = async (workflowState: any, setRows: any, setLoading: any) => {
    setLoading(true);
    const data = await getRepoContents("altitude80ai", "awscarddemo");
  
    if (Array.isArray(data)) {
      const transformedData = data.map(item => {
       
        let status;

        // is this file something other than a code file
        let isSpecialFile = specialFiles.includes(item.name) || specialExtensions.some(ext => item.name.endsWith(ext));
        
        // if it is not a code file, display message, otherwise, post workflow state
        if (isSpecialFile) {
          status = <span style={{color: 'grey'}}>Code not detected</span>;
        } else {
          status = renderWorkflowButtons(workflowState);
        } 
  
        return {
          hierarchy: item.hierarchy,
          _id: item.sha,
          id: nanoid(),
          name: item.name,
          size: item.size,
          path: item.path,
          url: item.url,
          giturl: item.git_url,
          htmlurl: item.html_url,
          downloadurl: item.download_url,
          status,           
          type: item.type,
          // ... other fields
        };
      });  
     
      setRows(transformedData);
      setLoading(false)
    }
    
  };

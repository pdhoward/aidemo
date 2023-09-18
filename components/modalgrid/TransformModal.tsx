import React, { useEffect, useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import CircularProgress from '@mui/material/CircularProgress';
import { red, blue, grey } from '@mui/material/colors';

import { a11yDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface ChatModalProps {
  open: boolean;
  onClose: () => void;
  selectedRows: any[];
  selectedAction: string;
  selectedComponent: string;
  isAIActive: boolean
}
 
interface Message {
  role: 'AI' | 'DEV';
  text: string;
  type: string;
  language?: string;
  component?: string;
}

const Typewriter = ({ text }: {text: string}) => {
  const [displayedText, setDisplayedText] = useState("");
  const speed = 20; // typing speed in milliseconds

  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      if (i < text.length) {
        setDisplayedText((prev) => prev + text.charAt(i));
        i++;
      } else {
        clearInterval(timer);
      }
    }, speed);

    return () => clearInterval(timer);
  }, [text]);

  return <>{displayedText}</>;
};

const TypewriterCode = ({ codeString, language="plaintext", typingSpeed }: {codeString: string, language: string, typingSpeed: any}) => {
  const [text, setText] = useState('');
  let index = 0;

  useEffect(() => {
    const timer = setInterval(() => {
      if (index < codeString.length) {
        setText((prevText) => prevText + codeString[index]);
        index++;
      }
    }, typingSpeed);

    return () => clearInterval(timer);
  }, [codeString, typingSpeed]);

  return (
    <SyntaxHighlighter language={language || "plaintext"} style={a11yDark}>
      {text}
    </SyntaxHighlighter>
  );
};

const findSelectedObj = (transformObj: any, comp: string, pgm: string, rule: string) => {

  if (comp.toLowerCase() === 'teststrategy') {
    if (pgm.toLowerCase() === rule.toLowerCase()) {
      return transformObj.children.find((child: any) => 
        child.component.toLowerCase() === 'teststrategy' && 
        child.name.toLowerCase() === 'all-rules'
      );
    } else {
      return transformObj.children.find((child: any) => 
        child.component.toLowerCase() === 'teststrategy' && 
        child.name.toLowerCase() === rule.toLowerCase()
      );
    }
  } else {
    return transformObj.children.find((child: any) => 
      child.language?.toLowerCase() === comp.toLowerCase() || 
      child.component.toLowerCase() === comp.toLowerCase()
    );
  }
};

  
  const fetchTransformation = async (pgm: string, rule: string, arg: string, comp: string) => {
    
    const res = await fetch('/api/fetchTranslationObject', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ pgm, rule, arg, comp }),
    });
    if (!res.ok) throw new Error('Failed to fetch translation.');
    return await res.json();
  };
  
  export default function TransformModal({ open, onClose, selectedRows, selectedAction, selectedComponent, isAIActive }: ChatModalProps) {
    const [chat, setChat] = useState<Message[]>([]);
    const [showFullText, setShowFullText] = useState(false);
    const [pgmHeader, setPgmHeader] = useState('')
    const [ruleHeader, setRuleHeader] = useState('')
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const refactorText = (originalText: any) => {

       let newText = originalText.replace(/\\n/g, "\n");

      // Remove backslashes before quotes
      newText = newText.replace(/\\"/g, '"');

  return newText;
    };
    
  
    useEffect(() => {
      setLoading(true);
      setError(null);
    
      const fetchData = async () => {
        try {
          if (selectedRows.length === 0) {
            throw new Error('Please select a rule to process.');
          }
          
          const [{ hierarchy }] = selectedRows;
          const pgm = hierarchy[0];
          const rule = hierarchy[hierarchy.length - 1];
          setChat([])
          setPgmHeader(hierarchy[0]);
          setRuleHeader(hierarchy[hierarchy.length - 1]);
          
          const arg = selectedAction; // one of the GPT engines like "OPENAI"
          const comp = selectedComponent // expected outcome like Agile, Test Strategy etc 
  
          const transformObj = await fetchTransformation(pgm, rule, arg, comp);

          // Extract the 'NATURAL' component
          const naturalComponent = transformObj.children.find((child: any) => 
            child.component.toLowerCase() === 'natural' &&
            child.name.toLowerCase() === rule.toLowerCase()
          );

          // from the object returned, find the child
          // if the comp = TESTSTRATEGY, then need to determine if it is for rule or for pgm
          const selectedObj = findSelectedObj(transformObj, comp, pgm, rule);       

          let componentType = 'text'

          // set the type based on component type
          if (selectedObj?.component == 'CODE' ) {
            componentType = 'code'
          } else {
            componentType = 'text'
          }
            // Refactor text for both components -- remove escape \ used in json objects
          const refactoredNaturalText = refactorText(naturalComponent?.text || '');
          const refactoredSelectedText = refactorText(selectedObj?.text || '');

          // Populate newChat
          const newChat: Message[] = [
            { role: 'AI', text: 'Natural Language translation:', type: 'text', component: 'MESSAGE' },
            { role: 'AI', text: refactoredNaturalText || '', type: 'text', language: 'english', component: 'NATURAL' },
            { role: 'AI', text: selectedObj?.component || '', type: 'text' },
            { role: 'AI', text: refactoredSelectedText|| '', type: componentType, language: selectedObj?.language || '', component: selectedObj?.component }
          ];
  
          setChat(newChat);
          
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
    }, [selectedRows, selectedAction]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
       <DialogTitle>
        <Typography className="text-xs">
          {`Translate business rule ${ruleHeader} from program ${pgmHeader} to ${selectedComponent}`}
        </Typography>
      </DialogTitle>

      <div className="dark:bg-gray-800 p-4">
    {chat.map((msg, index) => (
      <div key={index} className={`${msg.role === 'AI' ? 'text-green-400' : 'text-blue-400'} mb-2`}>
        
        {/* Refactored rendering logic */}
        {msg.type === 'text' ? (
          msg.component === 'NATURAL' ? (
            <>
              <Typography variant="body1" style={{ whiteSpace: 'pre-wrap', margin: '30px 30px 0 30px', color: '#fff' }}>
                {showFullText ? msg.text : `${msg.text.substring(0, 100)}...`}
              </Typography>
              <Button
                variant="contained"
                sx={{
                  ...(showFullText ? { backgroundColor: red[700] } : { backgroundColor: blue[700] }),
                  minWidth: 'auto',  // Override minimum width
                  width: 'fit-content',  // Only take the space it needs
                  height: 'auto', // Reset height
                  fontSize: '0.7rem', // Smaller font size
                  padding: '6px 12px', // Reduced padding
                  color: '#ffffff', // Text color to white
                }}               
                onClick={() => setShowFullText(!showFullText)}
              >
                {showFullText ? 'Show Less' : 'Show More'}
              </Button>

            </>
          ) : (
            msg.language === 'english' ? (
              <Typography variant="body1" style={{ whiteSpace: 'pre-wrap', margin: '30px 30px 0 30px', color: '#fff' }}>
                {isAIActive ? <Typewriter text={msg.text} /> : msg.text}
              </Typography>
            ) : (
              <Typography variant="body1">
                {msg.text}
              </Typography>
            )
          )
        ) : (
          isAIActive ? 
          <TypewriterCode 
            codeString={msg.text} 
            language={msg.language || 'plaintext'} 
            typingSpeed={20} 
          /> : 
          <SyntaxHighlighter 
            language={msg.language || "plaintext"} 
            style={a11yDark}>
            {msg.text}
          </SyntaxHighlighter>
        )}
        
      </div>
        ))}
        {loading && <CircularProgress />}
        {error && <div>Error: {error}</div>}
      </div>
    </Dialog>
  );
}



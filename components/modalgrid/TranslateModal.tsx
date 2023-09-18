import React, { useEffect, useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import Typography from '@mui/material/Typography';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import CircularProgress from '@mui/material/CircularProgress';
import Button from '@mui/material/Button';
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
}

const Typewriter = ({ text }: {text: string}) => {
  const [displayedText, setDisplayedText] = useState("");
  const speed = 30; // typing speed in milliseconds

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
const fetchCode = async (pgm: string, rule: string) => {
    const res = await fetch('/api/fetchExtractedRules', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ pgm, rule }),
    });
    if (!res.ok) throw new Error('Failed to fetch code.');
    return await res.json();
  };
  
  const fetchTranslation = async (pgm: string, rule: string, arg: string, comp:string) => {
    console.log(`---inside of translate modal -- fetchtranslate`)
    console.log(pgm, rule, arg, comp )
    const res = await fetch('/api/fetchTranslation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ pgm, rule, arg, comp }),
    });
    if (!res.ok) throw new Error('Failed to fetch translation.');
    return await res.json();
  };
  
  export default function TranslateModal({ open, onClose, selectedRows, selectedAction, selectedComponent, isAIActive }: ChatModalProps) {
    const [chat, setChat] = useState<Message[]>([]);
    const [showFullText, setShowFullText] = useState(false);
    const [pgmHeader, setPgmHeader] = useState('')
    const [ruleHeader, setRuleHeader] = useState('')
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
  
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
          
          const arg = selectedAction; // action invoked to translate - like OPENAI
          const comp = selectedComponent // type of outcome expected .. NATURAL, DRROLS, AGILE etc
  
          const [code, translation] = await Promise.all([
            fetchCode(pgm, rule),
            fetchTranslation(pgm, rule, arg, comp)
          ]);          
          
          const newChat: Message[] = [
            { role: 'AI', text: `Business Rule:`, type: 'text' },
            { role: 'AI', text: code, type: 'code', language: 'cobol' },
            { role: 'AI', text: `Natural Language Translation:`, type: 'text' },
            { role: 'AI', text: translation, type: 'text', language: 'english' }
          ];
  
          setChat(newChat);
        } catch (e: any) {
          setError(e.message);
        } finally {
          setLoading(false);
        }
      };
  
      fetchData();
    }, [selectedRows, selectedAction]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
       <DialogTitle>
        <Typography className="text-xs">
          {`Translate business rule ${ruleHeader} from program ${pgmHeader} to natural language`}
        </Typography>
      </DialogTitle>

      <div className="dark:bg-gray-800 p-4">
        {chat.map((msg, index) => (
           <div key={index} className={`${msg.role === 'AI' ? 'text-green-400' : 'text-blue-400'} mb-2`}>
           
           {msg.type === 'text' ? (
             msg.language === 'english' ? (
               <Typography variant="body1" style={{ whiteSpace: 'pre-wrap', margin: '30px 30px 0 30px', color: '#fff' }}>
                {isAIActive ? <Typewriter text={msg.text} /> : msg.text}
               </Typography>
             ) : (
               <Typography variant="body1">
                 {msg.text}
               </Typography>
             )
           ) : (
            <>
             <SyntaxHighlighter language={msg.language} style={a11yDark}>
                {showFullText ? msg.text : `${msg.text.substring(0, 100)}...`}
             </SyntaxHighlighter>
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
           )}
         </div>
        ))}
        {loading && <CircularProgress />}
        {error && <div>Error: {error}</div>}
      </div>
    </Dialog>
  );
}



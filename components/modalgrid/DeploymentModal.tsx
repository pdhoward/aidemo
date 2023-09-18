import React, { useEffect, useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import Typography from '@mui/material/Typography';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import CircularProgress from '@mui/material/CircularProgress';
import { red, blue, grey } from '@mui/material/colors';
import {awsDeploymentSteps} from '@/data/awsscript/aws.js'

import { a11yDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface ChatModalProps {
  open: boolean;
  onClose: () => void;
  selectedRows: any[];
  selectedAction: string;
  isAIActive: boolean
 
}
 
interface Instruction {  
  role: string;
  text: string;
  type: string; 
}

const Typewriter = ({ text, onFinished }: {text: string, onFinished: () => void  }) => {
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
        onFinished();
      }
    }, speed);
    
    return () => clearInterval(timer);
  }, [text]);

  return <>{displayedText}</>;
};

const TypewriterCode = ({ codeString, language="plaintext", typingSpeed, onFinished }: {codeString: string, language: string, typingSpeed: any, onFinished: () => void}) => {
  const [text, setText] = useState('');
  let index = 0;

  useEffect(() => {
    const timer = setInterval(() => {
      if (index < codeString.length) {
        setText((prevText) => prevText + codeString[index]);
        index++;
      }
      else {
        clearInterval(timer); 
        onFinished();
      }
    }, typingSpeed);
   
    return () => clearInterval(timer);
  }, [codeString, typingSpeed]);

  return (
    <SyntaxHighlighter 
      language={language || "plaintext"} 
      style={a11yDark}
      showLineNumbers={true}
      wrapLines={true}
      wrapLongLines={true}
      customStyle={{ 
        whiteSpace: 'pre-wrap', 
        margin: '30px 30px 0 30px', 
        wordWrap: 'break-word',
        overflowWrap: 'break-word'
      }}
      >
      {text}
    </SyntaxHighlighter>
  );
};

  export default function DeploymentModal({ open, onClose, selectedRows, selectedAction, isAIActive}: ChatModalProps) {
    const [chat, setChat] = useState<Instruction[]>([]);
    // Keep track of the current instruction index
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [typingQueue, setTypingQueue] = useState<Instruction[]>([]);
    const [renderedChat, setRenderedChat] = useState<Instruction[]>([]); 
    
    const [pgmHeader, setPgmHeader] = useState('')
    const [ruleHeader, setRuleHeader] = useState('')
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const refactorText = (originalText: any) => {
      return originalText.replace(/\\n/g, "\n");
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
  
          //////////////////////////////////////////////
          //////    mocked up response          ///////
          ///// for 9300-getacctdata-byacct     //////
          ////    from cpactupc                  ////
          //////////////////////////////////////////

          // extract instructions

          let instructions = awsDeploymentSteps[0].children[0].instructions

  
          setChat(instructions);
         
          
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

    useEffect(() => {
      if (chat.length > 0) {
        setTypingQueue(chat);
      }
    }, [chat]);
  
    const onTypingFinished = (completedInstruction: Instruction) => {
      // Append completed instruction to renderedChat
      setRenderedChat((prevRenderedChat) => [...prevRenderedChat, completedInstruction]);

       // Remove the first instruction from typingQueue
      setTypingQueue((prevQueue) => {
        const newQueue = [...prevQueue];
        newQueue.shift(); // Remove the first instruction
        return newQueue;
      });
    };
  
    useEffect(() => {
      if (typingQueue.length > 0) {
        setCurrentStepIndex((prevIndex) => prevIndex + 1);
      }
    }, [typingQueue]);

   

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
       <DialogTitle>
        <Typography className="text-xs">
          {`Deploy business rule ${ruleHeader} from program ${pgmHeader} to AWS`}
        </Typography>
      </DialogTitle>

      <div className="dark:bg-gray-800 p-4">
        {/* Render completed instructions from renderedChat */}
        {renderedChat.map((instruction, index) => (
          <div key={index} className={`${instruction.role === 'AI' ? 'text-green-400' : 'text-blue-400'} mb-2`}>
            {instruction.type === 'text' ? (
              <Typography variant="body1" style={{ whiteSpace: 'pre-wrap', margin: '30px 30px 0 30px', color: '#fff' }}>
                {instruction.text}
              </Typography>
            ) : (
              <SyntaxHighlighter
                language={instruction.type || "plaintext"} 
                style={a11yDark}
                showLineNumbers={true}
                wrapLines={true}
                wrapLongLines={true}
                customStyle={{ 
                  whiteSpace: 'pre-wrap', 
                  margin: '30px 30px 0 30px', 
                  wordWrap: 'break-word',
                  overflowWrap: 'break-word'
                }}
               >{instruction.text}
               </SyntaxHighlighter>
            )}
          </div>
        ))}

        {/* Display the first instruction from the typing queue */}
        {typingQueue.slice(0, 1).map((instruction, index) => (
          <div key={index} className={`${instruction.role === 'AI' ? 'text-green-400' : 'text-blue-400'} mb-2`}>
            {instruction.type === 'text' ? (
              <Typography variant="body1" style={{ whiteSpace: 'pre-wrap', margin: '30px 30px 0 30px', color: '#fff' }}>
                 {isAIActive ? 
                <Typewriter 
                  text={instruction.text} 
                  onFinished={() => onTypingFinished(instruction)} 
                />
                : (
                  <>
                    {instruction.text}
                    {onTypingFinished(instruction)}
                  </>
                )}
              </Typography>
            ) : (
              <>
              {isAIActive ? 
                <TypewriterCode
                  codeString={instruction.text}
                  language={instruction.type || 'plaintext'}
                  typingSpeed={20}
                  onFinished={() => onTypingFinished(instruction)}
                />
                : (
                  <>
                    <SyntaxHighlighter 
                      language={instruction.type || "plaintext"} 
                      style={a11yDark}
                      showLineNumbers={true}
                      wrapLines={true}
                      wrapLongLines={true}
                      customStyle={{ 
                        whiteSpace: 'pre-wrap', 
                        margin: '30px 30px 0 30px', 
                        wordWrap: 'break-word',
                        overflowWrap: 'break-word'
                      }}
                      >
                      {instruction.text}
                    </SyntaxHighlighter>
                    {onTypingFinished(instruction)}
                  </>
                )}
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



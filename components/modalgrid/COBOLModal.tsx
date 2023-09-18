import React, { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import CircularProgress from '@mui/material/CircularProgress';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { a11yDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  selectedRows: any[];
}

export default function COBOLModal({ open, onClose, selectedRows }: ModalProps) {
  const [code, setCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    const fetchExtractedRule = async() => {

      try {
        const [{ component, hierarchy, id, type }] = selectedRows;
        const pgm = hierarchy[0];
        const rule = hierarchy[hierarchy.length - 1];
  
        if (selectedRows.length > 0) {    

          const res = await fetch('/api/fetchExtractedRules', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ pgm, rule }),
          });  
          if (res.ok) {
            let response = await res.json();
            setCode(response);
          } else {
            const error = new Error('An error occurred while fetching the data.');
            
            throw error;
          }
        } else {
          alert('Please select a rule to process')
        }
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }

    }

   fetchExtractedRule()

  }, [selectedRows]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Extracted Business Rule</DialogTitle>
      <div className="dark:bg-gray-800 p-4">
        {loading ? (
          <CircularProgress />
        ) : error ? (
          <div>Error: {error}</div>
        ) : (
          code && (
            <SyntaxHighlighter language={"cobol"} style={a11yDark}>
              {code.trim()}
            </SyntaxHighlighter>
          )
        )}
      </div>
    </Dialog>
  );
}
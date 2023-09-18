import React, { useState, useEffect, useRef } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { a11yDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface CodeModalProps {
  downloadUrl: string;
  language: string; // The language of the code e.g. 'javascript', 'python', 'java' etc.
  onClose: () => void;
}

export default function CodeModal({ downloadUrl, language, onClose } : CodeModalProps) {
  const [code, setCode] = useState<string | null>(null);

  const modalRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      onClose();
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    fetch(downloadUrl)
      .then(response => response.text())
      .then(data => setCode(data));
  }, [downloadUrl]);

  return (
    <div className="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

      <div className="fixed inset-0 z-10 overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <div ref={modalRef} className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-3xl">
            <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
              <h3 className="text-base font-semibold leading-6 text-gray-900" id="modal-title">File Content</h3>
              {code && (
                <SyntaxHighlighter language={language} style={a11yDark}>
                  {code}
                </SyntaxHighlighter>
              )}
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
              <button onClick={onClose} type="button" className="mt-3 inline-flex w-full justify-center rounded-md bg-blue-400 px-3 py-2 text-sm font-semibold text-white shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-blue-500 sm:mt-0 sm:w-auto">Close</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

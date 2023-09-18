"use client"
import React, { useEffect, useState } from 'react';

type PDFURLsType = {
  [key: string]: string;
  'CARDDEMO-ME.pdf': string;
  'COACTUPC-BR.pdf': string;
  'COACTUPC-LC.pdf': string;
};

const pdfURLs: PDFURLsType = {
  'CARDDEMO-ME.pdf': 'https://strategicmachines.ai/pdf/CARDDEMO-ME.pdf',
  'COACTUPC-BR.pdf': 'https://strategicmachines.ai/pdf/COACTUPC-BR.pdf',
  'COACTUPC-LC.pdf': 'https://strategicmachines.ai/pdf/COACTUPC-LC.pdf'
};

export default function PDF() {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFileURL, setSelectedFileURL] = useState(pdfURLs['CARDDEMO-ME.pdf']);
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    // This useEffect can be modified to perform any asynchronous operations if required.
    setIsLoading(false);
  }, []);

  return (
    <div className={`flex flex-col items-center justify-center h-screen bg-gray-100 dark:bg-gray-800 ${darkMode ? 'dark' : ''}`}>
       <h1 className="text-xl font-bold text-gray-800 dark:text-white mb-6">Business Rules Analysis</h1>

      {isLoading ? (
        <p className="text-gray-800 dark:text-white">Loading...</p>
      ) : (
        <>
          <div className="flex justify-center mb-4 mt-2 space-x-2">
            {Object.keys(pdfURLs).map((fileName) => (
              <button
                key={fileName}
                className="py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-400 dark:bg-blue-700 dark:hover:bg-blue-600"
                onClick={() => setSelectedFileURL(pdfURLs[fileName as keyof typeof pdfURLs])}
              >
                {fileName}
              </button>
            ))}
          </div>
          <div className="pdf-container flex items-center justify-center w-full h-3/4 overflow-hidden rounded shadow-lg">
            <embed src={selectedFileURL} type="application/pdf" width="600" height="500" />
          </div>
        </>
      )}

      <button 
        onClick={() => setDarkMode(!darkMode)} 
        className="mt-4 py-2 px-4 bg-gray-800 text-white rounded hover:bg-gray-700 dark:bg-gray-200 dark:text-gray-800 dark:hover:bg-gray-300"
      >
        Toggle Dark Mode
      </button>
    </div>
  );
}

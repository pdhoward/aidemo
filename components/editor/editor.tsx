// pages/MyEditor.tsx
"use client"
import { useRef, useState } from "react";
import MonacoEditor from "@monaco-editor/react";
import { editor } from "monaco-editor";

export const runtime = 'edge'

const code = `import React, { FC } from 'react';
import Link from 'next/link';

// note the path name in the href is processed in the middleware to
// take the user to the multiclient applications

export default function Component() {    
  
  return (
    <Link href="/process">
      <div className="rounded-lg p-1.5 text-stone-700 transition-all duration-150 ease-in-out hover:bg-stone-200 active:bg-stone-300 dark:text-white dark:hover:bg-stone-700 dark:active:bg-stone-800">
        Welcome Back - Access the AI Code Machine
      </div>          
    </Link>
  )  

}`

export default function Editor() {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showText, setShowText] = useState('');

  const handleSave = async (text: string) => {

    console.log(`Saved to Github. ${text}`)
    setShowModal(true);
    setShowText(text)
    //alert(`Saved to Github. ${text}`);
   
  };

  const handleEditorDidMount = ( editorInstance: editor.IStandaloneCodeEditor ) => {
    editorRef.current = editorInstance;

    // Add a context menu action
    editorInstance.addAction({
      id: "unique-id",
      label: "A80 - Show Code",
      contextMenuGroupId: "1_modification",
      contextMenuOrder: 1.5,
      run: function (ed) {
        const model = ed.getModel();
        if (model) {
          const position = ed.getPosition();
          const text = model.getValueInRange(ed.getSelection()!);
          // Perform any action with the highlighted text
          handleSave(`You selected: ${text}`);
        }
      },
    });

    // Add a context menu action
    editorInstance.addAction({
      id: "0004",
      label: "A80 - Process Code",
      contextMenuGroupId: "2_modification",
      contextMenuOrder: 1.8,
      run: function (ed) {
        const model = ed.getModel();
        if (model) {
          const position = ed.getPosition();
          const text = model.getValueInRange(ed.getSelection()!);
          // Perform any action with the highlighted text
          handleSave(text)
        }
      },
    });

    // Modify context menu to include the custom action
    editorInstance.onContextMenu(() => {
     
      const action = editorInstance.getAction("unique id");
      //const action = actions.find((action: any) => action.id === "my-unique-id");
      if (action !== null) {
        action.run(editorInstance);
      }
    });
  };

  return (
    <div className="relative h-[90vh] overflow-hidden">
      <button 
        onClick={()=>handleSave('Clicked on Button')} 
        className="absolute top-3 right-3 z-10 bg-gray-800 text-white p-2 rounded hover:bg-gray-700 focus:outline-none focus:ring focus:ring-gray-500"
      >
        Save
      </button>
      <MonacoEditor
        height="100%"
        language="javascript"
        theme="vs-dark"
        value={code}
        options={{
          hover: {
            enabled: true
          },
          minimap: {
            enabled: true
          },
          lineNumbers: 'on',
          automaticLayout: true, // automatically adjust the layout
        }}
        onMount={handleEditorDidMount}
      />
       {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white w-1/3 rounded-lg shadow-lg overflow-hidden">
            <div className="p-5 text-gray-900">
              <h3 className="text-lg font-semibold mb-4">AI Function Invoked</h3>
              <p className="text-sm">{showText}</p>
            </div>
            <div className="bg-gray-100 p-4 flex justify-end">
              <button 
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-400 focus:outline-none focus:ring focus:ring-blue-200"
                onClick={() => setShowModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};




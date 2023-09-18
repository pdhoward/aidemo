// pages/MyEditor.tsx
import React, { useEffect, useRef } from "react";
import MonacoEditor from "@monaco-editor/react";
import { editor } from "monaco-editor";

export default function Editor() {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);

  const handleSave = async () => {
    if (editorRef.current) {
      const content = editorRef.current.getValue();
      // await fetch('/api/save', {
      //   method: 'POST',
      //   body: JSON.stringify({ content }),
      //   headers: { 'Content-Type': 'application/json' },
      // });
      alert(`Saved to Github. ${content}`);
    }
  };

  const handleEditorDidMount = ( editorInstance: editor.IStandaloneCodeEditor ) => {
    editorRef.current = editorInstance;

    // Add a context menu action
    editorInstance.addAction({
      id: "unique-id",
      label: "My Context Menu Action",
      contextMenuGroupId: "1_modification",
      contextMenuOrder: 1.5,
      run: function (ed) {
        const model = ed.getModel();
        if (model) {
          const position = ed.getPosition();
          const text = model.getValueInRange(ed.getSelection()!);
          // Perform any action with the highlighted text
          alert(`You selected: ${text}`);
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
        onClick={handleSave} 
        className="absolute top-3 right-3 z-10 bg-gray-800 text-white p-2 rounded hover:bg-gray-700 focus:outline-none focus:ring focus:ring-gray-500"
      >
        Save
      </button>
      <MonacoEditor
        height="100%"
        language="javascript"
        theme="vs-dark"
        value={"// Start typing code..."}
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
    </div>
  );
};



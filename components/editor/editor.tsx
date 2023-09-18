// pages/MyEditor.tsx
import React, { useEffect, useRef } from "react";
import MonacoEditor, { Monaco } from "@monaco-editor/react";
import { editor } from "monaco-editor";

export default function Editor() {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);

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
    <MonacoEditor
      height="90vh"
      language="javascript"
      value={"// Start typing code..."}
      onMount={handleEditorDidMount}
    />
  );
};



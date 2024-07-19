import React from 'react';
import  Monaco from '@monaco-editor/react';

const Editor = () => {
  return (
    <Monaco
      height="100vh"
      defaultLanguage="javascript"
      defaultValue="// some comment"
      theme="vs-dark"
    />
  );
};

export default Editor;

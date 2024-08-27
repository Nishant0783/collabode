import React, { useState, useEffect } from 'react';
import Monaco from '@monaco-editor/react';
import socket from '@/utils/socket';

const Editor = () => {
  const [code, setCode] = useState('// some comment'); // Initial code state

  // Handle code change event
  const handleEditorChange = (value) => {
    setCode(value);
    socket.emit('codeChange', { code: value });
  };

  useEffect(() => {
    // Listen for code updates from other clients
    socket.on('codeUpdate', (newCode) => {
      setCode(newCode);
    });

    return () => {
      socket.off('codeUpdate');
    };
  }, []);

  return (
    <Monaco
      height="100vh"
      defaultLanguage="java"
      // defaultValue="// some comment"
      value={code}
      onChange={handleEditorChange}
      theme="vs-dark"
      className='overflow-x-auto'
    />
  );
};

export default Editor;

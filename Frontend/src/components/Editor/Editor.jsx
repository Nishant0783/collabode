import React, { useEffect, useState, useRef, useCallback } from 'react';
import Monaco from '@monaco-editor/react';
import { useParams } from 'react-router-dom';
import debounce from '@/utils/debounce';
import socket from '@/utils/socket';


const Editor = () => {
  const [value, setValue] = useState('//comment');
  const { roomId } = useParams();
  const valueRef = useRef(value);

  useEffect(() => {
    // Listen for editor updates from other users
    socket.on('editorUpdate', (newValue) => {
      setValue(newValue);
    });

    return () => {
      socket.off('editorUpdate');
    };
  }, [roomId]);



  const sendEditorUpdate = useCallback(
    debounce((roomId, value) => {
      socket.emit('editorUpdate', { roomId, value });
    }, 10), // Adjust the debounce delay as needed
    []
  );

  useEffect(() => {
    valueRef.current = value;
    sendEditorUpdate(roomId, value);
  }, [value, roomId, sendEditorUpdate]);

  const handleEditorChange = (newValue) => {
    setValue(newValue);
  };

  return (
    <Monaco
      height="100vh"
      defaultLanguage="java"
      defaultValue="// some comment"
      theme="vs-dark"
      onChange={handleEditorChange}
      value={value}
      className='overflow-x-auto'
    />
  );
};

export default Editor;

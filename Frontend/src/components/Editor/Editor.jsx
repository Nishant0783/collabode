import React, { useEffect, useState, useRef, useCallback } from 'react';
import Monaco from '@monaco-editor/react';
import { useParams } from 'react-router-dom';
import debounce from '@/utils/debounce';
import socket from '@/utils/socket';


const Editor = () => {
 
  return (
    <Monaco
      height="100vh"
      defaultLanguage="java"
      defaultValue="// some comment"
      theme="vs-dark"
      // onChange={handleEditorChange}
      // value={value}
      className='overflow-x-auto'
    />
  );
};

export default Editor;

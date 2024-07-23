import Resizable from '@/components/Resizable/Resizable';
import socket from '@/utils/socket';

import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';

const Room = () => {
  const { roomId } = useParams();

  return (
    <>
      <Resizable />
    </>
  )
}

export default Room;

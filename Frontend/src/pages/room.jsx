import Resizable from '@/components/Resizable/Resizable';
import socket from '@/utils/socket';

import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';

const Room = () => {
  const { roomId } = useParams();

  useEffect(() => {
    const name = localStorage.getItem('name')
    socket.emit('joinRoom', ({ name, roomId }))
  }, [roomId])

  return (
    <>
      <Resizable />
    </>
  )
}

export default Room;

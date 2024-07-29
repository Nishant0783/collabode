import React, { useState, useEffect } from 'react';
import Resizable from '@/components/Resizable/Resizable';
import socket from '@/utils/socket';
import { useParams, useNavigate } from 'react-router-dom';

const Room = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [clients, setClients] = useState([]);

  useEffect(() => {
    const userName = sessionStorage.getItem('userName')
    socket.emit('join', ({ userName, roomId }))

    socket.on('joined', ({ clients, userName, socketId }) => {
      setClients(clients)
    })

    socket.on('userLeft', ({ socketId, userName, updatedClients }) => {
      console.log(`${userName} has left the room`);
      setClients(updatedClients);
    })

    const handleBeforeUnload = () => {
      socket.emit('leaveRoom');
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      socket.off('joined');
      socket.off('userLeft');
      window.removeEventListener('beforeunload', handleBeforeUnload);
      socket.emit('leaveRoom');
    }
  }, [roomId, navigate])

  return (
    <>
      <Resizable clients={clients}/>
    </>
  )
}

export default Room;
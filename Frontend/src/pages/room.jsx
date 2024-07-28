import React, { useState, useEffect } from 'react';
import Resizable from '@/components/Resizable/Resizable';
import socket from '@/utils/socket';
import { useParams } from 'react-router-dom';

const Room = () => {
  const { roomId } = useParams();
  const [clients, setClients] = useState([]);

  useEffect(() => {
    const userName = sessionStorage.getItem('userName')
    socket.emit('join', ({ userName, roomId }))

    socket.on('joined', ({ clients, userName, socketId }) => {
      setClients(clients)
    })

    socket.on('disconnected', ({ socketId, userName }) => {
      setClients((prev) => prev.filter((client) => client.socketId !== socketId))
    })

    return () => {
      socket.off('joined')
      socket.off("disconnected")
      socket.disconnect()
    }
  }, [roomId])

  return (
    <>
      <Resizable clients={clients}/>
    </>
  )
}

export default Room;

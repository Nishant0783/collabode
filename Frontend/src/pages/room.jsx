import React, { useState, useEffect } from 'react';
import Resizable from '@/components/Resizable/Resizable';
import { useParams, useNavigate } from 'react-router-dom';

const Room = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [clients, setClients] = useState([]);

  return (
    <>
      <Resizable clients={clients}/>
    </>
  )
}

export default Room;
import Resizable from '@/components/Resizable/Resizable';

import React from 'react';
import { useParams } from 'react-router-dom';

const Room = () => {
  const { roomId } = useParams();
  console.log(roomId)
  return (
    <>
      <Resizable />
    </>
  )
}

export default Room;

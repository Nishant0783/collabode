import React from 'react';
import { useParams } from 'react-router-dom';

const Room = () => {
  const { roomId } = useParams();
  console.log(roomId)
  return (
    <>
      <h1>{roomId}</h1>
    </>
  )
}

export default Room;

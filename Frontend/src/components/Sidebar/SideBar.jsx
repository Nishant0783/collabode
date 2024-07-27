import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { CloudCog, CopyIcon } from 'lucide-react';
import UserBlock from '../UserBlock/UserBlock';
import '../../customScrollBar.css'; // Make sure to import the custom CSS
import { useParams } from 'react-router-dom';
import socket from '@/utils/socket';

const Sidebar = () => {
  const [currUser, setCurrUser] = useState({});
  const { roomId } = useParams();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Listening joinedUser event to get current user
    socket.on('joinedUser', ({ username, roomId, socketId }) => {
      setCurrUser({
        username,
        roomId,
        socketId
      });
    });

    // Emitting getUser event to get the list of all the connected users
    socket.emit('getUser', { roomId });

    socket.on('roomUsers', ({ clients = [] }) => {
      console.log("clients: ", clients);
      setUsers(clients);
    });

    return () => {
      socket.off('joinedUser');
      socket.off('roomUsers');
    };
  }, [roomId]);

  useEffect(() => {
    console.log("Current user is: ", currUser);
    console.log("All users are: ", users);
  }, [currUser, users]);

  return (
    <div className='h-[100vh] bg-gray-500 py-[20px]'>
      <div className='flex flex-col px-[20px] h-full justify-between gap-y-[20px]'>
        <div className='custom-scrollbar overflow-y-auto' style={{ maxHeight: 'calc(100vh - 100px)' }}>
          <div className='grid gap-x-[10px] auto-rows-max gap-y-[15px]' style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(50px, 1fr))' }}>
            {
              users.length !== 0 &&
              users.map((user, index) => { 
                console.log('Rendering user:', user);
                if (user && user.username) {
                  console.log('Username:', user.username);
                  return <UserBlock user={user.username.slice(0, 1).toUpperCase()} key={index} />;
                } else {
                  console.error('User or username is undefined:', user);
                  return null;
                }
              })
            }
          </div>
        </div>
        <div className='flex flex-col gap-y-[10px]'>
          <hr className="h-px bg-gray-200 border-0" />
          <Button className="w-full bg-red-600 text-white hover:bg-red-700">Leave Room</Button>
          <Button variant="secondary" className="w-full">Copy Room Id <CopyIcon className='w-[20px] h-[20px] ml-[10px]' /> </Button>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;

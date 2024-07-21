import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { CopyIcon } from 'lucide-react';
import UserBlock from '../UserBlock/UserBlock';
import '../../customScrollBar.css'; // Make sure to import the custom CSS
import { useParams } from 'react-router-dom';
import socket from '@/utils/socket';

const Sidebar = () => {
  const [users, setUsers] = useState([]);
  const { roomId } = useParams();

  useEffect(() => {
    // Emit getUser event when the component mounts or when roomId changes
    if (roomId) {
      console.log("Emitting getUser event for roomId:", roomId);
      socket.emit('getUser', { roomId });
    }

    // Listen for the roomUsers event to get the list of users
    socket.on('roomUsers', (users) => {
      console.log("Received roomUsers event with users:", users);
      setUsers(users);
    });

    // Cleanup the event listener on component unmount
    return () => {
      socket.off('roomUsers');
    };
  }, [roomId]);

  useEffect(() => {
    console.log("Users are: ", users)
  }, [users])

  return (
    <div className='h-[100vh] bg-gray-500 py-[20px]'>
      <div className='flex flex-col px-[20px] h-full justify-between gap-y-[20px]'>
        <div className='custom-scrollbar overflow-y-auto' style={{ maxHeight: 'calc(100vh - 100px)' }}>
          <div className='grid gap-x-[10px] auto-rows-max gap-y-[15px]' style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(50px, 1fr))' }}>
            {
              users.length !== 0 &&
              users.map((user, index) => (
                <UserBlock user={user.slice(0, 1).toUpperCase()} key={index} />
              ))
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

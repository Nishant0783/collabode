import React, { useContext, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { CopyIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import generateRoomId from '@/utils/generateRoomId';
import socket from '@/utils/socket';
import axios from 'axios';
import AuthContext from '@/context/AuthProvider';
import useLogout from '@/hooks/useLogout';

const CreateRoom = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('')
  const [roomId, setRoomId] = useState('')
  const [error, setError] = useState('')
  const { setAuth } = useContext(AuthContext);
  const logout = useLogout();

  const startRoom = () => {
    if (userName == '' || roomId == '') {
      setError("Username and roomId is required")
      return;
    }
    sessionStorage.setItem('userName', userName)
    sessionStorage.setItem('roomId', roomId)
    navigate(`/room/${roomId}`)
  }
  const handleRoomIdGenerate = () => {
    const generatedRoomId = generateRoomId()
    console.log("room id generated: ", generatedRoomId)
    setRoomId(generatedRoomId)
  }
  const handleCopyRoomId = () => {
    navigator.clipboard.writeText(roomId)
  }

  const joinRoom = () => {
    console.log("Join room clicked")
    if (userName === '' || roomId === '') {
      setError("Username and roomId are required");
      return;
    }

    // Emit an event to check if the room exists
    socket.emit('checkRoom', { roomId }, (response) => {
      if (response.exists) {
        sessionStorage.setItem('userName', userName);
        sessionStorage.setItem('roomId', roomId);
        navigate(`/room/${roomId}`);
      } else {
        setError("Room ID does not exist");
      }
    });
  }

  const handleLogout = async (e) => {
    e.preventDefault();

    try { 
      await logout();
      navigate('/auth');
    } catch(error) {
      setError(error.message)
    }
  
  };

  const handleRefresh = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        'http://localhost:5000/api/v1/users/refresh-token',
        {}, // Send an empty object as the body for a POST request
        {
          withCredentials: true // Set withCredentials in the configuration object
        }
      );
      if (response.status === 201) {
        console.log(response);
        setAuth((prev) => ({
          ...prev,
          accessToken: response?.data?.accessToken
        }))
      }
    } catch (error) {
      console.log(error);
    }
  };


  return (
    <div className='flex items-center h-[100vh] justify-center align-middle'>
      <Tabs defaultValue="create" className="w-[400px]">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="join">Join Room</TabsTrigger>
          <TabsTrigger value="create">Create Room</TabsTrigger>
        </TabsList>
        <TabsContent value="join">
          <Card>
            <CardHeader>
              <CardTitle>Join Room</CardTitle>
              <CardDescription>Enter a valid room Id to join an existing room.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="space-y-1">
                <Label htmlFor="name">Name <span className='text-red-500'>*</span></Label>
                <Input id="name" placeholder="Enter your name"
                  onChange={(e) => setUserName(e.target.value)} value={userName}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="roomId">Room ID <span className='text-red-500'>*</span></Label>
                <Input id="roomId" placeholder="Enter valid room Id"
                  onChange={(e) => setRoomId(e.target.value)} value={roomId}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={joinRoom}>Join Room</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="create">
          <Card>
            <CardHeader>
              <CardTitle>Create Room</CardTitle>
              <CardDescription>Click on button to generate a unique room Id.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name <span className='text-red-500'>*</span></Label>
                <Input id="name" placeholder="Enter your name"
                  onChange={(e) => setUserName(e.target.value)} value={userName}
                />
              </div>
              <div className="space-y-2">
                <div className='flex items-center gap-x-[10px]'>
                  <Label htmlFor="roomId">Room ID <span className='text-red-500'>*</span></Label>
                  <CopyIcon className='w-[15px] h-[15px] cursor-pointer hover:text-blue-500' onClick={handleCopyRoomId} />
                </div>
                <Input id="roomId" placeholder="q2f-1234rt-7832gf-89" value={roomId} disabled />
              </div>
            </CardContent>
            <CardFooter>
              <div className='flex justify-between w-full'>
                <Button className="w-[150px]" variant="outline" onClick={handleRoomIdGenerate}>Generate Id</Button>
                <Button className="w-[150px]"
                  onClick={startRoom}
                >
                  Start Room
                </Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
        {error !== '' && <p className='text-red-500 text-center'>{error}</p>}
        <button className='bg-red-500 px-[10px] py-[5px] mr-[20px]' onClick={handleLogout}>Logout</button>
        <button className='bg-red-500 px-[10px] py-[5px]' onClick={handleRefresh}>Refresh</button>
      </Tabs>
    </div >
  )
}

export default CreateRoom;

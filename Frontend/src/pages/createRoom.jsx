import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { CopyIcon } from 'lucide-react';
import { io } from 'socket.io-client';
import { useNavigate } from 'react-router-dom';

const socket = io('http://localhost:5000')

const CreateRoom = () => {
  const [name, setName] = useState('')
  const [roomId, setRoomId] = useState('')
  const navigate = useNavigate();

  const startRoom = () => {
    if(name !== '' && roomId !== '') {
      console.log(name, " ", roomId, " sent to backend")
      socket.emit('joinRoom', {name, roomId});
      navigate(`/room/${roomId}`)
    }
  }

  return (
    <div className='flex items-center h-[100vh] justify-center align-middle'>
      <Tabs defaultValue="account" className="w-[400px]">
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
                <Input id="name" placeholder="Enter your name"/>
              </div>
              <div className="space-y-1">
                <Label htmlFor="roomId">Room ID <span className='text-red-500'>*</span></Label>
                <Input id="roomId" placeholder="Enter valid room Id" />
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" disabled>Join Room</Button>
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
                <Input id="name" placeholder="Enter your name" onChange={(e) => setName(e.target.value)} value={name}/>
              </div>
              <div className="space-y-2">
                <div className='flex items-center gap-x-[10px]'>
                  <Label htmlFor="roomId">Room ID</Label>
                  <CopyIcon className='w-[15px] h-[15px] cursor-pointer hover:text-blue-500'/>
                </div>
                <Input id="roomId" placeholder="q2f-1234rt-7832gf-89" onChange={(e) => setRoomId(e.target.value)} value={roomId}/>
              </div>
            </CardContent>
            <CardFooter>
              <div className='flex justify-between w-full'>
                <Button className="w-[150px]" variant="outline">Generate Id</Button>
                <Button className="w-[150px]" onClick={startRoom}>Start Room</Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div >
  )
}

export default CreateRoom;

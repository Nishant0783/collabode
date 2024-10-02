import { useEffect, useState } from "react"; 
import socket from "@/socket/socket";

const useSocket = () => {
    const [roomExists, setRoomExists] = useState(false);
    const [roomUsers, setRoomUsers] = useState([])

    useEffect(() => {
        console.log("Setting up socket listeners");
        socket.on('roomExists', (exists) => {
            setRoomExists(exists);
        });

        socket.on('roomUsers', (users) => {
            console.log("Recieved Users: ", users);
            setRoomUsers(users);
        })

        return () => {
            console.log("Cleaning up socket listeners");
            socket.off('roomExists');
            socket.off('roomUsers');
        }

    }, []);


    const createRoom = (roomId, callback) => {
        console.log("Emitting createRoom event with roomId:", roomId);
        socket.emit('createRoom', { roomId }, (response) => {
            console.log('Received response for createRoom:', response);
            if (response.success) {
                callback();
            } else {
                console.error("Room Creation failed: ", response.message)
            }
        });
    };

    const joinRoom = (roomId, callback) => {
        console.log("Join room event called")
        socket.emit('joinRoom', { roomId }, (response) => {
            console.log("Response of join room: ", response)
            if(response.success) {
                
            } else {
                console.error("Room join failed: ", response.message)
            }
        })
    }

    const getRoomUsers = (roomId) => {
        socket.emit('getRoomUsers', { roomId });
    }

    return { createRoom, joinRoom, roomExists, getRoomUsers, roomUsers };
};

export default useSocket;
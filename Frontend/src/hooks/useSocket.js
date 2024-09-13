import { useEffect, useState } from "react"; 
import socket from "@/socket/socket";

const useSocket = () => {
    const [roomExists, setRoomExists] = useState(false);

    useEffect(() => {
        console.log("Setting up socket listeners");
        socket.on('roomExists', (exists) => {
            setRoomExists(exists);
        });

        return () => {
            console.log("Cleaning up socket listeners");
            socket.off('roomExists');
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
        socket.emit('joinRoom', { roomId }, (response) => {
            if(response.success) {
                callback();
            } else {
                console.error("Room join failed: ", response.message)
            }
        })
    }

    return { createRoom, joinRoom, roomExists };
};

export default useSocket;
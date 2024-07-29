import { v4 as uuidv4 } from 'uuid';

export default function generateRoomId () {
    console.log("Function called")
    return uuidv4();
}
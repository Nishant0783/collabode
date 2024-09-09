// import axios from '@/api/axios';
import { Rss } from 'lucide-react';
import axios from '../api/axios';
import useAuth from './useAuth';

const useLogout = () => {
    const { setAuth } = useAuth();
    console.log("Inside logout hook")

    const logout = async () => {
        console.log("Inside logout")
        setAuth({});
        try {
            console.log("Inside try")
            const response = await axios.post('/users/logout', {},
                {   
                    withCredentials: true
                }
            );
            console.log("Response done for logout: ", response)
        } catch (error) {
            console.log("Error is: ", error)
            if (!error?.response) {
                throw new Error("No server Response")
            } else {
                console.log("Error in logging out: ", error)
                throw new Error("Some unkonwn error occured while logging out");
            }
        }
    }

    return logout;
}

export default useLogout
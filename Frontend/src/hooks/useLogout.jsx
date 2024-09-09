// import axios from '@/api/axios';
import axios from 'axios';
import useAuth from './useAuth';

const useLogout = () => {
    const { setAuth } = useAuth();
    console.log("Inside logout hook")

    const logout = async () => {
        setAuth({});
        try {
            console.log("Inside try")
            const response = await axios('/users/logout',
                {   
                    withCredentials: true
                }
            );
            console.log("Response done")
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
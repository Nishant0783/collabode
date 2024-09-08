// This component is used to refresh the access token.

import useAuth from "./useAuth"
import axios from './../api/axios';

const useRefreshToken = () => {
    const { setAuth } = useAuth();
    const refresh = async () => {
        const response = await axios.get('/refresh-token', {
            withCredentials: true
        })
        console.log("Response in useRefreshToken: ", response);

        setAuth(prev => {
            return { ...prev, accessToken: response?.data?.accessToken}
        })

        return response?.data?.accessToken;
    }   
    return refresh; 
}

export default useRefreshToken;


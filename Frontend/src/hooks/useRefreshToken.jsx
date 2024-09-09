    // This component is used to refresh the access token.

    import useAuth from "./useAuth"
    import axios from 'axios';

    const useRefreshToken = () => {
        console.log("Inside refresh token")
        const { setAuth } = useAuth();
        const refresh = async () => {
            try {
                const response = await axios.post('http://localhost:5000/api/v1/users/refresh-token', {}, {
                    withCredentials: true
                });
                console.log("Resposne of refresh token: ", response.data?.accessToken)
                setAuth(prev => ({
                    ...prev,
                    accessToken: response?.data?.accessToken,
                    user: response?.data?.user
                }));
                return response?.data?.accessToken;
            } catch (error) {
                console.error("Error refreshing token:", error);
                setAuth({});  // Clear auth state on error
                return null;
            }
        }
        return refresh;
    }
    
    export default useRefreshToken;
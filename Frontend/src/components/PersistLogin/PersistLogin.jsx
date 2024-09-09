import useAuth from "@/hooks/useAuth";
import useRefreshToken from "../../hooks/useRefreshToken";
import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";

const PersistLogin = () => {
    const [isLoading, setIsLoading] = useState(true);
    const refresh = useRefreshToken();
    const { auth, persist } = useAuth();

    useEffect(() => {
        console.log("PersistLogin component mounted");
        let isMounted = true;
        
        const verifyRefreshToken = async () => {
            try {
                console.log("Attempting to refresh token");
                await refresh();
                console.log("Token refresh successful");
            } catch (error) {
                console.log("Error during token refresh: ", error);
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        if (!auth?.accessToken) {
            verifyRefreshToken();
        } else {
            setIsLoading(false);
        }

        return () => {
            console.log("PersistLogin component unmounted");
            isMounted = false;
        };
    }, []);

    return (
        <>
            {!persist
                ? <Outlet />
                : isLoading
                    ? <p>Loading...</p>
                    : <Outlet />
            }
        </>
    );
}

export default PersistLogin;

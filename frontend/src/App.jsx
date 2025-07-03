import { useEffect, useState } from "react";
import "./App.css";
import { Outlet } from "react-router-dom";
import { useAppStore } from "./store";
import { apiClient } from "./lib/api-client";
import { GET_USER_INFO } from "./utils/constants";
import LoadingSpinner from "./components/ui/loadingSpinner";

function App() {
    const { userInfo, setUserInfo } = useAppStore();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getUserData = async () => {
            try {
                const response = await apiClient.get(GET_USER_INFO, {
                    withCredentials: true,
                });
                // console.log(response);
                if (response.status === 200 && response?.data?.data)
                    setUserInfo(response?.data?.data);
            } catch (error) {
                console.log("Erroe wile fetching user data: ", error);
            } finally {
                setLoading(false);
            }
        };
        if (!userInfo) {
            getUserData();
        } else {
            setLoading(false);
        }
    }, [ setUserInfo]);

    if (loading) return <LoadingSpinner />;
    return <Outlet />;
}

export default App;

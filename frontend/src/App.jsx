import { useEffect, useState } from "react";
import "./App.css";
import { Outlet } from "react-router-dom";
import { useAppStore } from "./store";
import { apiClient } from "./lib/api-client";
import { GET_USER_INFO } from "./utils/constants";

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
            }
        };
        if (!userInfo) {
            getUserData();
        } else {
            setLoading(false);
        }
    }, [userInfo, setUserInfo]);

    if (loading)
        return (
            <div>
                <h1>Loading....</h1>
            </div>
        );

    return (
        <>
            <Outlet></Outlet>
        </>
    );
}

export default App;

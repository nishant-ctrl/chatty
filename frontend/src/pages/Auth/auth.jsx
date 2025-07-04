import React, { useState, useEffect } from "react";

import Victory from "../../assets/victory.svg";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { apiClient } from "@/lib/api-client";
import { LOGIN_ROUTE, SIGNUP_ROUTE } from "@/utils/constants";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "@/store";
function Auth() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const { userInfo, setUserInfo } = useAppStore();
    useEffect(() => {
        if (userInfo) {
            if (userInfo.profileSetup) {
                navigate("/chat");
            } else {
                navigate("/profile");
            }
        }
    }, [userInfo, navigate]);
    const validateSignup = () => {
        if (!email.length) {
            toast.error("Email is required.");
            return false;
        }
        if (!password.length) {
            toast.error("Password is required.");
            return false;
        }
        if (password !== confirmPassword) {
            toast.error("Password and confirm password should be same.");
            return false;
        }
        return true;
    };
    const validateLogin = () => {
        if (!email.length) {
            toast.error("Email is required.");
            return false;
        }
        if (!password.length) {
            toast.error("Password is required.");
            return false;
        }
        return true;
    };

    const handleLogin = async () => {
        if (validateLogin()) {
            const response = await apiClient.post(
                LOGIN_ROUTE,
                { email, password },
                { withCredentials: true }
            );
            // console.log(response.data.data.user);
            if (response.data?.data.user._id) {
                setUserInfo(response.data.data.user);
                if (response.data?.data.user.profileSetup) {
                    navigate("/chat");
                } else {
                    navigate("/profile");
                }
                toast.success(response.data.message);
            }
        }
    };

    const handleSignup = async () => {
        if (validateSignup()) {
            try {
                const response = await apiClient.post(
                    SIGNUP_ROUTE,
                    { email, password },
                    { withCredentials: true }
                );
                // console.log(response);
                if (response.status === 201) {
                    // setUserInfo(response.data?.data);
                    // navigate("/profile");
                    setEmail("");
                    setPassword("");
                    setConfirmPassword("");
                    toast.success(response.data.message);
                }
            } catch (error) {
                const status = error.response?.status;
                const message =
                    error.response?.data?.message || "Something went wrong";

                console.error("API Error:", status, message);
                toast.error(message);
            }
        }
    };

    return (
        <div className="h-[100vh] flex items-center justify-center">
            <div className="h-[80vh] bg-white border-white text-opacity-90 w-[80vh] shadow-2xl md:w-[90vh] lg:[70vh] xl:[60vh] rounded-3xl   xl:grid-cols-2">
                <div className="flex flex-col gap-20 items-center justify-center">
                    <div className="flex items-center justify-center flex-col">
                        <div className="flex items-center justify-center">
                            <h1 className="text-5xl font-gold md:text-6xl">
                                Welcome
                            </h1>
                            <img
                                src={Victory}
                                alt="Victory emoji"
                                className="h-[100px]"
                            />
                        </div>
                        <p className="font-medium text-center">
                            Fill in the details to get started with the best
                            chat app!
                        </p>
                    </div>
                    <div className="flex items-center justify-center w-full">
                        <Tabs defaultValue="login" className="w-3/4">
                            <TabsList className="bg-transparent rounded-none w-full">
                                <TabsTrigger
                                    value="login"
                                    className="data-[state=active]:bg-transparent text-black text-opacity-90 border-b-2 rounded-none w-full data-[state=active]:text-black data-[state=active]:font-semibold data-[state=active]:border-b-purple-500 p-3 transition-all duration-300 "
                                >
                                    Login
                                </TabsTrigger>
                                <TabsTrigger
                                    className="data-[state=active]:bg-transparent text-black text-opacity-90 border-b-2 rounded-none w-full data-[state=active]:text-black data-[state=active]:font-semibold data-[state=active]:border-b-purple-500 p-3 transition-all duration-300 "
                                    value="signup"
                                >
                                    Signup
                                </TabsTrigger>
                            </TabsList>
                            <TabsContent
                                className="flex flex-col gap-5 mt-10"
                                value="login"
                            >
                                <Input
                                    placeholder="Email"
                                    type="email"
                                    className="rounded-full p-6"
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                    }}
                                />
                                <Input
                                    placeholder="Password"
                                    type="password"
                                    className="rounded-full p-6"
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                    }}
                                />
                                <Button
                                    className="rounded-full p-6"
                                    onClick={handleLogin}
                                >
                                    Login
                                </Button>
                            </TabsContent>
                            <TabsContent
                                className="flex flex-col gap-5 mt-10"
                                value="signup"
                            >
                                <Input
                                    placeholder="Email"
                                    type="email"
                                    className="rounded-full p-6"
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                    }}
                                />
                                <Input
                                    placeholder="Password"
                                    type="password"
                                    className="rounded-full p-6"
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                    }}
                                />
                                <Input
                                    placeholder="Confirm Password"
                                    type="password"
                                    className="rounded-full p-6"
                                    value={confirmPassword}
                                    onChange={(e) => {
                                        setConfirmPassword(e.target.value);
                                    }}
                                />
                                <Button
                                    className="rounded-full p-6"
                                    onClick={handleSignup}
                                >
                                    Signup
                                </Button>
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
                {/* <div className="hidden xl:flex justify-center items-center" >
                    <img src={Background} alt="background login image" className="h-auto"/>
                </div> */}
            </div>
        </div>
    );
}

export default Auth;

import React from "react";
import { Avatar, AvatarImage } from "@/components/ui/avatar.jsx";
import { useAppStore } from "@/store";
import { getColor } from "@/lib/utils";
import {
    Tooltip,
    TooltipTrigger,
    TooltipContent,
} from "@/components/ui/tooltip";
import { FiEdit2 } from "react-icons/fi";
import { IoPowerSharp } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { apiClient } from "@/lib/api-client";
import { LOGOUT_ROUTE } from "@/utils/constants";
function ProfileInfoComponent() {
    const { userInfo, setUserInfo } = useAppStore();
    const navigate = useNavigate();
    const handleLogout = async () => {
        try {
            const response = await apiClient.post(
                LOGOUT_ROUTE,
                {},
                { withCredentials: true }
            );
            if (response.status === 200) {
                setUserInfo(null);
                navigate("/auth");
            }
        } catch (error) {
            console.log("Error while logout: ", error);
        }
    };
    return (
        <div className="absolute bottom-0 h-16 flex justify-between items-center p-10 w-full bg-[#2a2b33] ">
            <div className="flex gap-3 items-center justify-center">
                <div className="w-12 h-12 relative ">
                    <Avatar className="h-12 w-12  rounded-full">
                        {userInfo.image ? (
                            <AvatarImage
                                src={userInfo.image}
                                alt="profile"
                                className="object-cover w-full h-full bg-black"
                            />
                        ) : (
                            <div
                                className={`uppercase h-12 w-12  text-lg border-[1px] flex items-center justify-center rounded-full ${getColor(
                                    userInfo.color
                                )}`}
                            >
                                {userInfo.firstName
                                    ? userInfo.firstName.charAt(0)
                                    : userInfo.email.charAt(0)}
                            </div>
                        )}
                    </Avatar>
                </div>
                <div>
                    {userInfo.firstName && userInfo.lastName
                        ? `${userInfo.firstName} ${userInfo.lastName}`
                        : ""}
                </div>
            </div>
            <div className="flex gap-5">
                <Tooltip>
                    <TooltipTrigger>
                        <FiEdit2
                            className="text-purple-500 text-xl font-medium "
                            onClick={() => {
                                navigate("/profile");
                            }}
                        />
                    </TooltipTrigger>
                    <TooltipContent className="bg-[#1c1b1e] border-none text-white">
                        <p>Edit Profile</p>
                    </TooltipContent>
                </Tooltip>
                <Tooltip>
                    <TooltipTrigger>
                        <IoPowerSharp
                            className="text-red-500 text-xl font-medium "
                            onClick={handleLogout}
                        />
                    </TooltipTrigger>
                    <TooltipContent className="bg-[#1c1b1e] border-none text-white">
                        <p>Logout</p>
                    </TooltipContent>
                </Tooltip>
            </div>
        </div>
    );
}

export default ProfileInfoComponent;

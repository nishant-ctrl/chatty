import { useAppStore } from "@/store";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import ContactsContainer from "./components/contactsContainer";
import EmptyChatContainer from "./components/emptyChatContainer";
import ChatContainer from "./components/chatContainer";

function Chat() {
    const { userInfo,selectedChatType,isUploading,
        isDownloading,
        fileUploadProgress,
        fileDownloadProgress, } = useAppStore();
    const navigate = useNavigate();
    useEffect(() => {
        if (!userInfo?.profileSetup) {
            toast("Please setup profile to continue.");
            navigate("/profile");
        }
    }, [userInfo, navigate]);
    return (
        <div className="flex h-[100vh] text-white overflow-hidden">
            {isUploading && (
                <div className="h-[100vh] w-[100vw] fixed top-0 z-10 left-0 bg-black/80 flex items-center justify-center flex-col gap-5 backdrop-blur-lg">
                    <h5 className="text-4xl font-semibold text-white animate-pulse">
                        Uploading File
                    </h5>

                    <div className="w-72 bg-white/10 rounded-full h-3 overflow-hidden">
                        <div
                            className="bg-blue-500 h-3 transition-all duration-200"
                            style={{ width: `${fileUploadProgress}%` }}
                        ></div>
                    </div>

                    <p className="text-white text-lg tracking-wide">
                        {fileUploadProgress}%
                    </p>
                </div>
            )}
            {isDownloading && (
                <div className="h-[100vh] w-[100vw] fixed top-0 z-10 left-0 bg-black/80 flex items-center justify-center flex-col gap-5 backdrop-blur-lg">
                    <h5 className="text-4xl font-semibold text-white animate-pulse">
                        Downloading File
                    </h5>

                    <div className="w-72 bg-white/10 rounded-full h-3 overflow-hidden">
                        <div
                            className="bg-blue-500 h-3 transition-all duration-200"
                            style={{ width: `${fileDownloadProgress}%` }}
                        ></div>
                    </div>

                    <p className="text-white text-lg tracking-wide">
                        {fileDownloadProgress}%
                    </p>
                </div>
            )}

            <ContactsContainer />
            {selectedChatType === undefined ? (
                <EmptyChatContainer />
            ) : (
                <ChatContainer />
            )}
        </div>
    );
}

export default Chat;

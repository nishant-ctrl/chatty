import { useSocket } from "@/context/SocketContext";
import { apiClient } from "@/lib/api-client";
import { useAppStore } from "@/store";
import { UPLOAD_FILE_ROUTE } from "@/utils/constants";
import EmojiPicker from "emoji-picker-react";
import React, { useEffect, useRef, useState } from "react";
import { GrAttachment } from "react-icons/gr";
import { IoSend } from "react-icons/io5";
import { RiEmojiStickerLine } from "react-icons/ri";
function MessageBar() {
    const emojiRef = useRef();
    const fileInputRef = useRef();
    const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);
    const {
        selectedChatType,
        selectedChatData,
        userInfo,
        setIsUploading,
        setFileUploadProgress,
    } = useAppStore();
    const [message, setMessage] = useState("");
    const socket = useSocket();
    const handleAddEmoji = (emoji) => {
        setMessage((msg) => msg + emoji.emoji);
    };
    const handleSentMessage = async () => {
        if (selectedChatType === "contact") {
            socket.emit("sendMessage", {
                sender: userInfo._id,
                content: message,
                recipient: selectedChatData._id,
                messageType: "text",
                fileUrl: undefined,
            });
        } else if (selectedChatType === "channel") {
            socket.emit("sendChannelMessage", {
                sender: userInfo._id,
                content: message,
                messageType: "text",
                fileUrl: undefined,
                channelId: selectedChatData._id,
            });
        }
        setMessage("");
    };

    const handleAttachmentClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };
    const handleAttactmentChange = async (e) => {
        try {
            const file = e.target.files[0];
            // console.log(file)
            if (file) {
                const formData = new FormData();
                formData.append("file", file);
                setIsUploading(true);
                setFileUploadProgress(0);
                const response = await apiClient.post(
                    UPLOAD_FILE_ROUTE,
                    formData,
                    {
                        withCredentials: true,
                        onUploadProgress: (data) => {
                            setFileUploadProgress(
                                Math.round(100 * data.loaded) / data.total
                            );
                        },
                    }
                );
                setIsUploading(false);
                if (response.status === 200 && response.data.data.fileUrl) {
                    if (selectedChatType === "contact") {
                        socket.emit("sendMessage", {
                            sender: userInfo._id,
                            content: undefined,
                            recipient: selectedChatData._id,
                            messageType: "file",
                            fileUrl: response.data.data.fileUrl,
                            fileName: response.data.data.fileName,
                        });
                    } else if (selectedChatType === "channel") {
                        socket.emit("sendChannelMessage", {
                            sender: userInfo._id,
                            content: undefined,
                            messageType: "file",
                            fileUrl: response.data.data.fileUrl,
                            fileName: response.data.data.fileName,
                            channelId: selectedChatData._id,
                        });
                    }
                }
            }
        } catch (error) {
            console.log("Error while ulpoading file: ", error);
            setIsUploading(false);
        }
    };

    useEffect(() => {
        function handleClickOutside(e) {
            if (emojiRef.current && !emojiRef.current.contains(e.target)) {
                setEmojiPickerOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [emojiRef]);

    return (
        <div className="h-[10vh] bg-[#1c1d25] flex justify-center items-center px-8 mb-6 gap-6">
            <div className="flex-1 flex bg-[#2a2b33] rounded-md items-center gap-5 pr-5">
                <input
                    type="text"
                    className="flex-1 p-5 bg-transparent rounded-md focus:border-none focus:outline-none"
                    placeholder="Enter message"
                    onChange={(e) => {
                        setMessage(e.target.value);
                    }}
                    value={message}
                />
                <button
                    className="text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all"
                    onClick={handleAttachmentClick}
                >
                    <GrAttachment className="text-2xl" />
                </button>
                <input
                    type="file"
                    className="hidden"
                    ref={fileInputRef}
                    onChange={(e) => {
                        handleAttactmentChange(e);
                    }}
                />
                <div className="relative ">
                    <button
                        className="text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all"
                        onClick={() => {
                            setEmojiPickerOpen(true);
                        }}
                    >
                        <RiEmojiStickerLine className="text-2xl" />
                    </button>
                    <div className="absolute bottom-16 right-0" ref={emojiRef}>
                        <EmojiPicker
                            theme="dark"
                            open={emojiPickerOpen}
                            onEmojiClick={handleAddEmoji}
                            autoFocusSearch={false}
                        />
                    </div>
                </div>
            </div>
            <button
                className="bg-[#8417ff] rounded-md flex justify-center items-center p-5 hover:bg-[#741bda] focus:bg-[#741bda] focus:border-none focus:outline-none focus:text-white duration-300 transition-all"
                onClick={handleSentMessage}
            >
                <IoSend className="text-2xl" />
            </button>
        </div>
    );
}

export default MessageBar;

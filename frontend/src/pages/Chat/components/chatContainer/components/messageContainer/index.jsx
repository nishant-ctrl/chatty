import { apiClient } from "@/lib/api-client";
import { useAppStore } from "@/store";
import { GET_ALL_MESSAGES_ROUTE } from "@/utils/constants";
import moment from "moment";
import React, { useEffect, useRef } from "react";
import {MdFolderZip} from "react-icons/md"
import {IoMdArrowRoundDown} from "react-icons/io"
import { downloadFileFromUrl } from "@/lib/downloadFromUrl";
function MessageContainer() {
    const scrollRef = useRef();
    const {
        selectedChatType,
        selectedChatData,
        userInfo,
        selectedChatMessages,
        setSelectedChatMessages,
    } = useAppStore();

    function checkIfImage(fileUrl) {
        return /\.(jpg|jpeg|png|gif|webp|bmp|svg|ico|heic|heif|tif|tiff)$/i.test(fileUrl);
    }
    const downloadFile = async (fileUrl,fileName)=>{
        console.log(fileUrl)
        downloadFileFromUrl(fileUrl,fileName)
    }

    const renderMessages = () => {
        let lastDate = null;
        return selectedChatMessages.map((message, index) => {
            const messageDate = moment(message.createdAt).format("YYYY-MM-DD");
            const showDate = messageDate !== lastDate;
            lastDate = messageDate;
            return (
                <div key={index}>
                    {showDate && (
                        <div className="text-center text-gray-500 my-2">
                            {moment(message.createdAt).format("LL")}
                        </div>
                    )}
                    
                    {selectedChatType === "contact" && (
                        renderDmMessages(message)
                    )
                        }
                </div>
            );
        });
    };
    const renderDmMessages = (message) => {
        const {userInfo}=useAppStore.getState();
        return (
            <div
                className={`${
                    message.sender === userInfo._id ? "text-right" : "text-left"
                }`}
            >
                {message.messageType === "text" && (
                    <div
                        className={`${
                            message.sender !== selectedChatData._id
                                ? "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50"
                                : "bg-[#2a2b33]/5 text-white/80 border-white/20"
                        } border inline-block p-4 rounded my-1 max-w-[50%] break-words`}
                    >
                        {message.content}
                    </div>
                )}
                {message.messageType === "file" && (
                    <div
                        className={`${
                            message.sender !== selectedChatData._id
                                ? "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50"
                                : "bg-[#2a2b33]/5 text-white/80 border-white/20"
                        } border inline-block p-4 rounded my-1 max-w-[50%] break-words`}
                    >
                        {checkIfImage(message.fileUrl) ? (
                            <div className="cursor-pointer">
                                <img
                                    src={message.fileUrl}
                                    alt="message Image"
                                    height={300}
                                    width={300}
                                />
                            </div>
                        ) : (
                            <div className="flex items-center justify-center gap-4">
                                <span className="text-white/8 text-3xl bg-black/20 rounded-full p-3">
                                    <MdFolderZip />
                                </span>
                                <span>{message.fileName}</span>
                                <span className="bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300"
                                onClick={()=>{downloadFile(message.fileUrl,message.fileName)}}
                                >
                                    <IoMdArrowRoundDown />
                                </span>
                            </div>
                        )}
                    </div>
                )}
                <div className="text-xs text-gray-600">
                    {moment(message.createdAt).format("LT")}
                </div>
            </div>
        );
    };

    useEffect(()=>{
        const getMessages=async () => {
            try {
                const response=await apiClient.post(GET_ALL_MESSAGES_ROUTE,{id:selectedChatData._id},{withCredentials:true})
                if(response.data.data){
                    setSelectedChatMessages(response.data.data);
                }
            } catch (error) {
                console.log("Error while fetching messages: ",error)
            }
        }
        if(selectedChatData._id){
            if(selectedChatType==="contact"){
                getMessages()
            }
        }
    },[selectedChatData,selectedChatType,setSelectedChatMessages])
    
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [selectedChatMessages]);

    return (
        <div className="flex-1 overflow-y-auto scrollbar-hidden p-4 px-8 md:w-[65vw] lg:w-[70vw] xl:w-[80vw] w-full">
            {renderMessages()}
            <div ref={scrollRef} />
        </div>
    );
}

export default MessageContainer;

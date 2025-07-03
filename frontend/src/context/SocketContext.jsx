import { useAppStore } from "@/store";
import { HOST } from "@/utils/constants";
import { createContext, useContext, useEffect, useRef } from "react";
import { io } from "socket.io-client";

export const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
    const socket = useRef();
    const { userInfo } = useAppStore();

    useEffect(() => {
        if (userInfo && !socket.current) {
            socket.current = io(HOST, { withCredentials: true });

            socket.current.on("connect", () => {
                console.log("Connected to socket server");
            });
            socket.current.on("disconnect", () => {
                console.log("Disconnected from socket server");
            });

            const handleReceiveMessages = (messages) => {
                const { selectedChatData, selectedChatType, addMessage } =
                    useAppStore.getState();
                    // console.log("Reached")
                if (
                    selectedChatType !== undefined &&
                    (selectedChatData._id === messages.sender._id ||
                        selectedChatData._id === messages.recipient._id)
                ) {
                    // console.log("message received");
                    addMessage(messages);
                }
            };

            socket.current.on("recieveMessage", handleReceiveMessages);
        }
        return () => {
            if (socket.current) {
                socket.current.disconnect();
                socket.current = null;
            }
        };
    }, [userInfo]);

    return (
        <SocketContext.Provider value={socket.current}>
            {children}
        </SocketContext.Provider>
    );
};

export function useSocket() {
    return useContext(SocketContext);
}

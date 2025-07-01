import { useAppStore } from "@/store";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import ContactsContainer from "./components/contactsContainer";
import EmptyChatContainer from "./components/emptyChatContainer";
import ChatContainer from "./components/chatContainer";

function Chat() {
    const { userInfo } = useAppStore();
    const navigate = useNavigate();
    useEffect(() => {
        if (!userInfo?.profileSetup) {
            toast("Please setup profile to continue.");
            navigate("/profile");
        }
    }, [userInfo, navigate]);
    return <div>
        <ContactsContainer />
        <EmptyChatContainer />
        <ChatContainer />
    </div>;
}

export default Chat;

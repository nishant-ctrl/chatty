import React, { useEffect } from "react";
import ProfileInfoComponent from "./components/profileInfo";
import NewDM from "./components/newDm";
import { apiClient } from "@/lib/api-client";
import { GET_CONTACTS_FOR_DM_ROUTE, GET_USER_CHANNELS_ROUTE } from "@/utils/constants";
import { useAppStore } from "@/store";
import {ContactList} from "@/components/contactList.jsx"
import CreateChannel from "./components/createChannel";
function ContactsContainer() {
    const {
        directMessagesContacts,
        setDirectMessagesContacts,
        selectedChatMessages,
        channels,
        setChannels
    } = useAppStore();
    useEffect(() => {
        const getContacts = async () => {
            try {
                const response = await apiClient.get(
                    GET_CONTACTS_FOR_DM_ROUTE,
                    { withCredentials: true }
                );
                // console.log(response.data.data)
                setDirectMessagesContacts(response.data.data);
            } catch (error) {
                console.log("Error while fetching contacts for dm: ", error);
            }
        };
        const getUserChannels = async () => {
            try {
                const response = await apiClient.get(
                    GET_USER_CHANNELS_ROUTE,
                    { withCredentials: true }
                );
                // console.log(response.data.data)
                setChannels(response.data.data);
            } catch (error) {
                console.log("Error while fetching user channels: ", error);
            }
        };
        getContacts();
        getUserChannels();
    }, [setChannels,setDirectMessagesContacts]);



    return (
        <div className="relative md:w-[35vw] lg:w-[30vw] xl:w-[20vw] bg-[#1b1c24] border-r-2 border-[#2f303b] w-full">
            <div className="pt-3">
                <Logo />
            </div>
            <div className="my-5">
                <div className="flex pr-10 justify-between items-center">
                    <Title text="Direct Messages" />
                    <NewDM />
                </div>
                <div className="max-h-[38vh] overflow-auto scrollbar-hidden">
                    <ContactList contacts={directMessagesContacts} />
                </div>
            </div>
            <div className="my-5">
                <div className="flex pr-10 justify-between items-center">
                    <Title text="Channels" />
                    <CreateChannel />
                </div>
                <div className="max-h-[38vh] overflow-auto scrollbar-hidden">
                    <ContactList contacts={channels} isChannel={true} />
                </div>
            </div>
            <ProfileInfoComponent />
        </div>
    );
}

export default ContactsContainer;

const Logo = () => {
    return (
        <div className="flex p-5  justify-start items-center gap-2">
            <svg
                id="logo-38"
                width="78"
                height="32"
                viewBox="0 0 78 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                {" "}
                <path
                    d="M55.5 0H77.5L58.5 32H36.5L55.5 0Z"
                    className="ccustom"
                    fill="#8338ec"
                ></path>{" "}
                <path
                    d="M35.5 0H51.5L32.5 32H16.5L35.5 0Z"
                    className="ccompli1"
                    fill="#975aed"
                ></path>{" "}
                <path
                    d="M19.5 0H31.5L12.5 32H0.5L19.5 0Z"
                    className="ccompli2"
                    fill="#a16ee8"
                ></path>{" "}
            </svg>
            <span className="text-3xl font-semibold ">Chatty</span>
        </div>
    );
};

const Title = ({ text }) => {
    return (
        <h6 className="uppercase tracking-widest text-neutral-400 pl-10 font-light text-opacity-90 text-sm">
            {text}
        </h6>
    );
};

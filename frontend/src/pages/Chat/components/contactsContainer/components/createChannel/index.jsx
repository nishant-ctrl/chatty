import React, { useState, useCallback, useEffect } from "react";

import {
    Tooltip,
    TooltipTrigger,
    TooltipContent,
} from "@/components/ui/tooltip";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { FaPlus } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import { apiClient } from "@/lib/api-client";
import {
    CREATE_CHANNEL_ROUTE,
    GET_ALL_CONTACTS_ROUTE,
} from "@/utils/constants";

import { useAppStore } from "@/store";
import { Button } from "@/components/ui/button";
import MultipleSelector from "@/components/ui/multiSelect";
function CreateChannel() {
    const { setSelectedChatType, setSelectedChatData, addChannel } =
        useAppStore();

    const [newChannelModel, setNewChannelModel] = useState(false);

    const [allContacts, setAllContacts] = useState([]);
    const [selectedContacts, setselectedContacts] = useState([]);
    const [channelName, setChannelName] = useState("");

    useEffect(() => {
        const getData = async () => {
            try {
                const response = await apiClient.get(GET_ALL_CONTACTS_ROUTE, {
                    withCredentials: true,
                });
                if (response.status === 200 && response.data.data) {
                    setAllContacts(response.data.data);
                }
            } catch (error) {
                console.log("Erroe while getting contacts: ", error);
            }
        };
        getData();
    }, []);

    const createChannel = async () => {
        try {
            if (channelName.trim().length > 0 && selectedContacts.length > 0) {
                const response = await apiClient.post(
                    CREATE_CHANNEL_ROUTE,
                    {
                        name: channelName,
                        members: selectedContacts.map(
                            (contact) => contact.value
                        ),
                    },
                    { withCredentials: true }
                );
                setChannelName("");
                setselectedContacts([]);
                setNewChannelModel(false);
                if (response.status === 200 && response.data.data) {
                    addChannel(response.data.data);
                }
            }
        } catch (error) {
            console.log("Error while creating channel: ", error);
            setChannelName("");
            setselectedContacts([]);
            setNewChannelModel(false);
        }
    };

    return (
        <>
            <Tooltip>
                <TooltipTrigger>
                    <FaPlus
                        className="text-neutral-400 font-light text-opacity-90 text-start hover:text-neutral-100 cursor-pointer transition-all duration-300"
                        onClick={() => {
                            setNewChannelModel(true);
                        }}
                    />
                </TooltipTrigger>
                <TooltipContent className="bg-[#1c1b1e] bg-none mb-2 p-3 text-white">
                    <p>Create New Channel</p>
                </TooltipContent>
            </Tooltip>
            <Dialog open={newChannelModel} onOpenChange={setNewChannelModel}>
                <DialogContent className="bg-[#181920] border-none text-white w-[400px] h-[400px] flex flex-col">
                    <DialogHeader>
                        <DialogTitle>
                            Please fill the details for new channel
                        </DialogTitle>
                        <DialogDescription></DialogDescription>
                    </DialogHeader>
                    <div>
                        <Input
                            placeholder="Channel Name"
                            className="rounded-lg p-6 bg-[#2c2e3b] border-none"
                            onChange={(e) => setChannelName(e.target.value)}
                            value={channelName}
                        />
                    </div>
                    <div>
                        <MultipleSelector
                            className="rounded-lg bg-[#2c2e3b] border-none py-2 text-white"
                            defaultOptions={allContacts}
                            placeholder="Search Contacts"
                            value={selectedContacts}
                            onChange={setselectedContacts}
                            emptyIndicator={
                                <p className="text-center text-lg leading-10 text-gray-600">
                                    No results found.
                                </p>
                            }
                        />
                    </div>
                    <div>
                        <Button
                            className="w-full bg-purple-700 hover:bg-purple-900 transition-all duration-300"
                            onClick={createChannel}
                        >
                            Create Channel
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}

export default CreateChannel;

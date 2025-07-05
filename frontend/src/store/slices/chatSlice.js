export const createChatSlice = (set, get) => ({
    selectedChatType: undefined,
    selectedChatData: undefined,
    selectedChatMessages: [],
    directMessagesContacts: [],
    isUploading: false,
    isDownloading: false,
    fileUploadProgress: 0,
    fileDownloadProgress: 0,
    channels:[],
    setChannels:(channels)=>set({channels}),
    setIsUploading: (isUploading) => set({ isUploading }),
    setIsDownloading: (isDownloading) => set({ isDownloading }),
    setFileUploadProgress: (fileUploadProgress) => set({ fileUploadProgress }),
    setFileDownloadProgress: (fileDownloadProgress) =>
        set({ fileDownloadProgress }),
    setDirectMessagesContacts: (directMessagesContacts) =>
        set({ directMessagesContacts }),
    setSelectedChatType: (selectedChatType) => set({ selectedChatType }),
    setSelectedChatData: (selectedChatData) => set({ selectedChatData }),
    setSelectedChatMessages: (selectedChatMessages) =>
        set({ selectedChatMessages }),
    addChannel:(channel)=>{
        const channels = get().channels;
        set({channels:[channel,...channels]})
    },
    addMessage: (message) => {
        const selectedChatMessages = get().selectedChatMessages;
        const selectedChatType = get().selectedChatType;
        // console.log("addMessage got:", message);
        // console.log("sender:", message.sender);
        // console.log("recipient:", message.recipient);
        set({
            selectedChatMessages: [
                ...selectedChatMessages,
                {
                    ...message,
                    recipient:
                        selectedChatType === "channel"
                            ? message.recipient
                            : message.recipient._id,
                    sender:
                        selectedChatType === "channel"
                            ? message.sender
                            : message.sender._id,
                },
            ],
        });
    },
    closeChat: () =>
        set({
            selectedChatType: undefined,
            selectedChatData: undefined,
            selectedChatMessages: [],
        }),
});

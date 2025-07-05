export const HOST=import.meta.env.VITE_SERVER_URL

export const AUTH_ROUTES = `api/v1/user`;
export const LOGIN_ROUTE = `${AUTH_ROUTES}/login`;
export const LOGOUT_ROUTE = `${AUTH_ROUTES}/logout`;
export const SIGNUP_ROUTE = `${AUTH_ROUTES}/register`;
export const GET_USER_INFO = `${AUTH_ROUTES}/user-info`;
export const UPDATE_PROFILE_ROUTE = `${AUTH_ROUTES}/update-profile`;
export const ADD_PROFILE_IMAGE_ROUTE = `${AUTH_ROUTES}/add-profile-image`;
export const REMOVE_PROFILE_IMAGE_ROUTE = `${AUTH_ROUTES}/remove-profile-image`;

export const CONTACTS_ROUTES=`api/v1/contacts`
export const SEARCH_ROUTE=`${CONTACTS_ROUTES}/search`
export const GET_CONTACTS_FOR_DM_ROUTE = `${CONTACTS_ROUTES}/get-contacts-for-dm`;
export const GET_ALL_CONTACTS_ROUTE = `${CONTACTS_ROUTES}/get-all-contacts`;

export const MESSAGES_ROUTES=`api/v1/messages`
export const GET_ALL_MESSAGES_ROUTE = `${MESSAGES_ROUTES}/get-messages`;
export const UPLOAD_FILE_ROUTE = `${MESSAGES_ROUTES}/upload-file`;

export const CHANNEL_ROUTES=`api/v1/channel`
export const CREATE_CHANNEL_ROUTE = `${CHANNEL_ROUTES}/create-channel`;
export const GET_USER_CHANNELS_ROUTE = `${CHANNEL_ROUTES}/get-user-channels`;

export const API_BASE_URL = "http://localhost:3001";

export const ENDPOINTS = {

    WEBSOCKET: "ws://localhost:3001?user_id=",

    LOGIN: `${API_BASE_URL}/login`,
    LOGOUT: `${API_BASE_URL}/logout`,

    GET_CURRENT_USER: `${API_BASE_URL}/getCurrentUser`,
    GET_USER: `${API_BASE_URL}/getUser/:user_id`,
    GET_PROFILE: `${API_BASE_URL}/getProfile/:handle`,

    UPDATE_ACCOUNT_SETTINGS: `${API_BASE_URL}/updateAccountSettings`,
    UPDATE_PROFILE_SETTINGS: `${API_BASE_URL}/updateProfileSettings/:handle`,

    FOLLOW_USER: `${API_BASE_URL}/followUser`,
    UNFOLLOW_USER: `${API_BASE_URL}/unfollowUser`,
    FOLLOW_CHECK: `${API_BASE_URL}/followCheck`,

    CREATE_POST: `${API_BASE_URL}/createPost`,
    UPDATE_POST: `${API_BASE_URL}/updatePost/:postId`,
    DELETE_POST: `${API_BASE_URL}/deletePost/:postId`,
    GET_POSTS: `${API_BASE_URL}/getPosts`,
    GET_USER_POSTS: `${API_BASE_URL}/getUserPosts/:handle`,

    CREATE_COMMENT: `${API_BASE_URL}/createComment`,
    UPDATE_COMMENT: `${API_BASE_URL}/updateComment/:comment_id`,
    DELETE_COMMENT: `${API_BASE_URL}/deleteComment/:comment_id`,
    GET_COMMENTS: `${API_BASE_URL}/getComments`,

    GET_CONVERSATIONS: `${API_BASE_URL}/getConversations`,
    GET_CONVERSATION: `${API_BASE_URL}/getConversation/:conversation_id`,
    GET_MESSAGES: `${API_BASE_URL}/getMessages`,
    CREATE_MESSAGE: `${API_BASE_URL}/createMessage`,
    CREATE_CONVERSATION: `${API_BASE_URL}/createConversation`,
    UPDATE_CONVERSATION_PARTICIPANTS: `${API_BASE_URL}/updateConversationParticipants`,
    SET_MESSAGES_AS_READ: `${API_BASE_URL}/setMessagesAsRead`,

    CREATE_NOTIFICATION: `${API_BASE_URL}/createNotification`,
    GET_NOTIFICATIONS: `${API_BASE_URL}/getNotifications`,
    UPDATE_NOTIFICATION: `${API_BASE_URL}/updateNotification`,

    UPLOAD_PROFILE_PICTURE: `${API_BASE_URL}/settings/uploadProfilePicture`,

    SEARCH: `${API_BASE_URL}/search`,
};
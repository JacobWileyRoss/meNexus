export const API_BASE_URL = "http://localhost:3001";

export const ENDPOINTS = {
    CREATE_POST: `${API_BASE_URL}/createPost`,
    UPDATE_POST: `${API_BASE_URL}/updatePost/:postId`,
    DELETE_POST: `${API_BASE_URL}/deletePost/:postId`,
    GET_PROFILE: `${API_BASE_URL}/getProfile/:handle`,
    GET_USER_POSTS: `${API_BASE_URL}/getUserPosts/:handle`,
};

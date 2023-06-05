import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Post from "../Post/Post";
import PostForm from "../PostForm/PostForm";
import "./UserProfile.css";

const UserProfile = () => {
    const [profile, setProfile] = useState({});
    const [posts, setPosts] = useState([]);
    const [editingPostId, setEditingPostId] = useState(null);
    const [editedPostContent, setEditedPostContent] = useState("");


    const { handle } = useParams();

    function getProfile() {
        axios.get(`/getProfile/${handle}`).then((response) => {
            let data = response.data;
            if (Array.isArray(data) && data.length > 0) {
                setProfile(data[0]);
            }
            console.log(response.data);
        });
    }

    function getUserPosts() {
        axios.get(`/getUserPosts/${handle}`).then((response) => {
            let data = response.data;
            setPosts(data);
            console.log(response.data);
        });
    }

    function handleEdit(postId) {
        console.log("Editing post:", postId);
        setEditingPostId(postId);

        // Fetch the current post content and set it as the initial value for editing
        const postToEdit = posts.find((post) => post.post_id === postId);
        if (postToEdit) {
            setEditedPostContent(postToEdit.content);
        }
    }

    function handleSave() {
        // Update the post in the database with the edited content
        axios
            .put(`/updatePost/${editingPostId}`, {
                content: editedPostContent,
            })
            .then((response) => {
                console.log(response.data);
                setEditingPostId(null);
                setEditedPostContent("");
                getUserPosts(); // Refresh the posts after editing the post
            });
    }

    function handleDelete(post_id) {
        console.log("Deleting post:", post_id);
        axios.delete(`/deletePost/${post_id}`).then((response) => {
            console.log(response.data);
            getUserPosts(); // Refresh the posts after deleting the post
        });
    }

    useEffect(() => {
        getProfile();
        getUserPosts();
    }, []);

    return (
        <div className="profile-container">
            <div className="profile-header">
                <div className="profile-picture">
                    <img src={profile.profile_picture} alt="Profile" />
                </div>
                <div className="profile-info">
                    <h2 className="profile-name">{profile.name}</h2>
                    <p className="profile-bio">{profile.bio}</p>
                    <p className="profile-location">{profile.location}</p>
                </div>
            </div>
            <div className="profile-posts">
                <PostForm handle={handle} />
                {posts.length > 0 ? (
                    posts
                        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                        .map((post, index) => (
                            <Post
                                key={index}
                                handle={post.handle}
                                username={post.username}
                                date={post.created_at}
                                content={post.content}
                                comments={post.comment_count}
                                likes={post.likes}
                                onDelete={() => handleDelete(post.post_id)}
                                onEdit={() => handleEdit(post.post_id)} // Pass the handleEdit function as prop
                                isEditing={editingPostId === post.post_id} // Pass a flag to indicate if the post is being edited
                                editedContent={editedPostContent}
                                onContentChange={(event) =>
                                    setEditedPostContent(event.target.value)
                                }
                                onSave={handleSave}
                            />
                        ))
                ) : (
                    <div>Loading...</div>
                )}
            </div>
        </div>
    );
};

export default UserProfile;

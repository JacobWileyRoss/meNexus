import React, {useEffect, useState} from "react";
import axios from "axios";
import {useParams} from "react-router-dom";
import Post from "../Post/Post";
import PostForm from "../PostForm/PostForm";
import "./UserProfile.css"

const UserProfile = () => {
    const [profile, setProfile] =useState({});
    const [posts, setPosts] = useState([]);

    // This pulls the :handle param from the URL and assigns it to variable called handle
    const { handle } = useParams();

    const url = useParams();

    // Function gets the user's profile give the specified handle
    function getProfile() {
        axios.get(`/getProfile/${handle}`).then((response) => {
            let data = response.data;
            if (Array.isArray(data) && data.length > 0) {
                setProfile(data[0]);
            }
            console.log(response.data);
        });
    }

    // Function gets user's posts give the specified handle
    function  getUserPosts() {
        axios.get(`/getUserPosts/${handle}`).then((response) => {
            let data = response.data;
            setPosts(data);
            console.log(response.data);
        })
    }

    useEffect(() => {
        getProfile();
        getUserPosts();

    }, []); // The empty array tells React to only run the effect once (when the component mounts)

    //TODO profile-container renders under the header and needs the top-margin corrected
    return (
        <div className="profile-container">
            <div className="profile-header">
                {/* User UserProfile Picture */}
                <div className="profile-picture">
                    <img src={profile.profile_picture}/>
                </div>

                {/* User Information */}
                <div className="profile-info">
                    <h2 className="profile-name">{profile.name}</h2>
                    <p className="profile-bio">{profile.bio}</p>
                    <p className="profile-location">{profile.location}</p>
                </div>
            </div>
            {/* User Friends */}
            {/*
            <div className="profile-friends">
                <h3 className="section-title">Friends</h3>
                {/* List of user friends
                {user.friends.map((friend) => (
                    <div className="friend" key={friend.id}>
                        {/* Friend profile picture
                        <img src={friend.picture} alt="Friend Picture" />
                        {/* Friend name */}
            {/*<p className="friend-name">{friend.name}</p>
                    </div>
                ))}
            </div>
        */}
            {/* User Posts */}
            <div className="profile-posts">
                {/* Form for submitting a new post*/}
                <PostForm handle={handle}/>
                {/* List of user posts */}
                {/* This sorts the posts by date, then maps through it displaying most recent posts
                    first/on top of feed*/}
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

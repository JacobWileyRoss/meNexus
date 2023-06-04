import HomeLayout from "../Layouts/HomeLayout";
import Post from "../Post/Post";
import PostForm from "../PostForm/PostForm";

import axios, {post} from "axios";
import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";

const HomePage = () => {
    const [posts, setPosts] = useState([]);
    const url = useParams();

    //TODO HomePage relies on a hardcoded URL for getUserPosts
    function  getFriendsPosts() {
        axios.get('/getUserPosts/1').then((response) => {
            let data = response.data;
            setPosts(data);
            console.log(response.data);
        })
    }


    useEffect(() => {
        getFriendsPosts();

    }, []); // The empty array tells React to only run the effect once (when the component mounts)

    return (
        //Checks if posts is empty, then maps through the array of UserPosts and renders them all
        <HomeLayout>
            <PostForm/>
            // This sorts the posts by date, then maps through it displaying most recent posts first/on top of feed
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

        </HomeLayout>

    )
}

export default HomePage;
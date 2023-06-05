import HomeLayout from "../Layouts/HomeLayout";
import Post from "../Post/Post";
import PostForm from "../PostForm/PostForm";

import axios from "axios";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

const HomePage = () => {
    const [posts, setPosts] = useState([]);
    const { handle } = useParams();

    useEffect(() => {
        const getUserPosts = async () => {
            try {
                const userResponse = await axios.get('/getCurrentUser');
                const handle = userResponse.data.handle;
                console.log('Retrieved handle:', handle);

                if (handle) {
                    const postsResponse = await axios.get(`/getUserPosts/${handle}`);
                    const postsData = postsResponse.data;
                    setPosts(postsData);
                    console.log('Retrieved posts:', postsData);
                }
            } catch (error) {
                console.error('Error fetching user posts:', error);
            }
        };

        getUserPosts();
    }, []);


    return (
        <HomeLayout>
            <PostForm />
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
    );
};

export default HomePage;

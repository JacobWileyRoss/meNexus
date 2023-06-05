import React, {useEffect, useState} from "react";
import './PostForm.css'
import axios from "axios";

const PostForm = ({handle}) => {
    const [text, setText] = useState(`What's on your mind?`);
    const [posts, setPosts] = useState([]);
    const [formClicked, setFormClicked] = useState(false);
    const [expanded, setExpanded] = useState(false);


    const styles = {
        textarea: {
            width: expanded ? '43%' : '43%',
            height: expanded ? '200%' : '100%',
        },
    };

    const handleSubmit = () => {
        const post = {
            handle: handle,
            content: text,
        };
        console.log(post);
        axios
            .post("http://localhost:3001/createPost", post)
            .then((response) => {
                console.log(response.data);
                setText("");
            })
            .catch((error) => {
                console.error(error);
            });
    };


    const fetchPosts = () => {
        axios
            .get(`http://localhost:3001/getUserPosts/${handle}`)
            .then((response) => {
                console.log(response.data);
                setPosts(response.data); // Update the 'posts' state with the fetched posts
            })
            .catch((error) => {
                console.error(error);
            });
    };

    useEffect(() => {
        fetchPosts(); // Fetch posts when the component mounts
    }, [handle]); // Fetch posts when the 'handle' prop changes


    const handleFormClick = () => {
        if (!formClicked && text === `What's on your mind?`) {
            setText("");
        }
        setFormClicked(true);
    };




    return (
        <div>
            <div onClick={handleFormClick}>
                {!formClicked }
                <textarea
                    className="TextEntryField"
                    style={styles.textarea}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                />
            </div>
            <button onClick={handleSubmit}>Post</button>

        </div>
    );
}

export default PostForm;
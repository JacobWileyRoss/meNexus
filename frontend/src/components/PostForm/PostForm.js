import React, {useState} from "react";
import './PostForm.css'
import axios from "axios";
const PostForm = ({handle}) => {
    //State variable that keeps track of the form text area and sets prompt text
    const [text, setText] = useState(`What's on your mind?`);

    //State variable keeps track of whether the text area is expanded after clicking for responsiveness
    const [expanded, setExpanded] = useState(false);

    //formClicked tracks whether the user has clicked on the form to clear prompt text
    const [formClicked, setFormClicked] = useState(false);

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
        // Send the data to the database
        axios
            .post("/createPost", { content: text })
            .then((response) => {
                // Handle the response as needed

                console.log(response.data);
                // Reset the text field after posting
                setText("");
            })
            .catch((error) => {
                // Handle any errors that occur during the request
                console.error(error);
            });
    };

    const handleFormClick = () => {
        if (!formClicked) {
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
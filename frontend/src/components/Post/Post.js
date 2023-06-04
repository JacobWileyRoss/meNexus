import React from "react";
import './Post.css'

const Post = ({ username, handle, date, content, likes, comments }) => {
    return (
        <div className="user-post">
            <div className="user-post-header">
                <div className="user-identity">
                    <h3 className="user-identity-username">{username}</h3>
                    <h4 className="user-identity-handle">{handle}</h4>
                </div>
                <div className="user-post-date">
                    <p>{date}</p>
                </div>
            </div>
            <div className="user-post-content">
                <p>{content}</p>
            </div>
            <div className="user-post-stats">
                <p className="user-post-stats-likes">{likes} likes </p>
                <p className="user-post-stats-comments">{comments} comments</p>
            </div>
        </div>
    );
};

export default Post;

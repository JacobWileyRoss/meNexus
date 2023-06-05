import React from "react";
import "./Post.css";

const Post = ({
                  username,
                  handle,
                  date,
                  content,
                  likes,
                  comments,
                  onEdit,
                  onDelete,
                  isEditing,
                  editedContent,
                  onContentChange,
                  onSave,
              }) => {
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
                {isEditing ? (
                    <textarea value={editedContent} onChange={onContentChange} />
                ) : (
                    <p>{content}</p>
                )}
            </div>
            <div className="user-post-stats">
                <p className="user-post-stats-likes">{likes} likes </p>
                <p className="user-post-stats-comments">{comments} comments</p>
            </div>
            <div className="user-post-actions">
                {isEditing ? (
                    <button onClick={onSave}>Save</button>
                ) : (
                    <button onClick={onEdit}>Edit</button>
                )}
                <button onClick={onDelete}>Delete</button>
            </div>
        </div>
    );
};

export default Post;

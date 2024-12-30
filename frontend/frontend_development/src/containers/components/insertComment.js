import React, { useState, useRef, useEffect, useContext } from 'react';
import CurrentUserContext from '../../util/CurrentUserContext';
const InsertComment = ({ reply_to, resource_id, unfolded, always_unfolded, onNewComment }) => {
    const [commentText, setCommentText] = useState('');
    const [isUnfolded, setIsUnfolded] = useState(unfolded || always_unfolded);
    const [submittedMessage, setSubmittedMessage] = useState('');
    const { currentUser, setCurrentUser } = useContext(CurrentUserContext);
    const commentRef = useRef(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("COMMENT:",commentText, reply_to, resource_id)
        try {
            const response = await fetch('/api/insert-comment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    commentText: commentText,
                    replyTo: reply_to,
                    resourceId: resource_id,
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const result = await response.json();
            if (result.success) {
                setCommentText(''); // Clear the comment input
                if (!always_unfolded) {
                    setIsUnfolded(false); // Fold the comment box only if always_unfolded is not true
                }
                setSubmittedMessage('Comment submitted');
                setTimeout(() => {
                    setSubmittedMessage(''); // Clear the message after 3 seconds
                }, 3000);

                const currentDateTime = new Date();
                const formattedDateTime = currentDateTime.toISOString().replace('T', ' ').substring(0, 19);
                
                console.log("insert comment: ", currentUser)
                onNewComment({ 
                    id: result.commentId, // assuming the ID of the new comment is returned
                    comment_text: commentText, 
                    reply_of_children: [],
                    created_at: formattedDateTime,
                    username: currentUser.username,
                    firstname: currentUser.firstname,
                    lastname: currentUser.lastname,
                    color: currentUser.color,
                    roleName: currentUser.role.roleName
                }, reply_to); 
            } else {
                setSubmittedMessage('Error inserting comment.');
                setTimeout(() => {
                    setSubmittedMessage(''); // Clear the message after 3 seconds
                }, 3000);
            }
        } catch (error) {
            console.error("Error inserting comment:", error);
            setSubmittedMessage('Error inserting comment.');
            setTimeout(() => {
                setSubmittedMessage(''); // Clear the message after 3 seconds
            }, 3000);
        }
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!always_unfolded && commentRef.current && !commentRef.current.contains(event.target)) {
                setIsUnfolded(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [commentRef, always_unfolded]);

    return (
    <>
        <div ref={commentRef}>
            {isUnfolded ? (
                <>
                    <h3>Insert Comment</h3>
                    <form onSubmit={handleSubmit}>
                        <textarea
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            placeholder="Type your comment here..."
                            rows="4"
                            cols="50"
                            required
                        ></textarea>
                        <br />
                        <button type="submit">Submit Comment</button>
                    </form>
                    {submittedMessage && <p>{submittedMessage}</p>}
                </>
            ) : null}
        </div>
        {!isUnfolded && (
            <button className='reply-comment' onClick={() => setIsUnfolded(true)}>Reply</button>
        )}
    </>
);

};

export default InsertComment;

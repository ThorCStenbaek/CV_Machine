import React, { useState, useContext } from 'react';
import InsertComment from './insertComment';
import ExpandIcon from './micro_components/expandIcon';
import TimeAgo from './micro_components/timeAgo';
import CurrentUserContext from '../../util/CurrentUserContext';
import NameInitialsAvatar from './micro_components/NameInitialsAvatar';
import isAdmin from '../../util/isAdmin';

const Comment = ({ comment, resource_id, onNewComment, showButtons=true, collapse, collapseChildren }) => {
    const [isCollapsed, setIsCollapsed] = useState(collapse || false);
    const { currentUser, setCurrentUser } = useContext(CurrentUserContext);

    const [deleteSuccess, setDeleteSuccess] = useState(false);
    // New state variable
    

    //For deleting commemnts
     const deleteComment = async () => {
    try {
      const response = await fetch('/api/delete-comment', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ commentID:comment.id, userID:comment.created_by }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Comment deleted successfully');
        setDeleteSuccess(true);
      } else {
        alert(`Error: ${data.message || 'Failed to delete comment'}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while deleting the comment');
    }
  };


    const toggleCollapse = () => {
        setIsCollapsed(!isCollapsed);
        console.log("Comment toggled");
    };
    console.log("comment: ", comment)

    return (
        <li key={comment.id} className='comment' id={`commentID${comment.id}`}>
            {!isCollapsed ? (
                <>
                    <div onClick={toggleCollapse} style={{ cursor: 'pointer' }} className='collapseComment'>
                <div className='innerCollapseComment'></div>
                    </div>
            

                    <div className='inner-comment'>   
                        <div className='just-left align-items-top' style={{display: 'flex'}}>
                            {currentUser.id == comment.created_by ?
                                <NameInitialsAvatar firstName={`${currentUser.firstname}`} lastName={`${currentUser.lastname}`} color={`${currentUser.color}`} height='25px' width='25px' fontSize='10px' />
                            : <NameInitialsAvatar firstName={comment.firstname} lastName={comment.lastname} color={comment.color} height='25px' width='25px' fontSize='10px' />}
                            
                            <div style={{display: 'flex', gap: '10px'}}>
                            <h4 className='comment-name'> {currentUser.id == comment.created_by ? `${currentUser.username} (${currentUser.firstname} ${currentUser.lastname})` : `${comment.username} (${comment.firstname} ${comment.lastname})`}</h4>
                                <p className='comment-name'> {currentUser.id==comment.created_by ? `${currentUser.role.roleName}` : `${comment.roleName}` }</p>
                                </div>
                                <p className='comment-name'><TimeAgo timestamp={comment.created_at} /></p>
                            </div>
                
                        <p className='comment-text'>{deleteSuccess ? "deleted" : comment.comment_text}</p>
                        {showButtons && (
                            <div className='flex just-left align-items-center'>
                                <InsertComment
                                    reply_to={comment.id}
                                    resource_id={resource_id}
                                    unfolded={false}
                                    always_unfolded={false}
                                    onNewComment={onNewComment}
                                />
                                <button className='reply-comment' onClick={toggleCollapse}>Collapse</button>
                         
                            </div>)}
                        {(currentUser.id==comment.created_by || isAdmin(currentUser) ) ? <button className='reply-comment' style={{ color: 'red' }} onClick={deleteComment} > delete</button>: null}
                        </div> 
                                
           
                    </>
            ) : 
                <>
                    <div   onClick={toggleCollapse}  className='flex just-left align-items-center collapsed-comment'>
                <ExpandIcon  style={{ cursor: 'pointer' }}/>
                        <div className='flex just-left align-items-center'>                                              <h4 className='comment-name'> {currentUser.id == comment.created_by ? `${currentUser.username} (${currentUser.firstname} ${currentUser.lastname})` : `${comment.username} (${comment.firstname} ${comment.lastname})` }</h4>
                            <p className='comment-name'><TimeAgo timestamp={comment.created_at} /></p>
                        <p className='comment-name' style={{color: "#737373"}}>{comment.comment_text.substring(0.20)}... </p></div>
                        </div>
                </>
                }
            {!isCollapsed && comment.reply_of_children && comment.reply_of_children.length > 0 && (
                <ul>
                    {comment.reply_of_children.map(childComment => (
                        <Comment key={childComment.id} comment={childComment} resource_id={resource_id} onNewComment={onNewComment} showButtons={showButtons } collapse={collapseChildren} collapseChildren={collapseChildren} />
                    ))}
                </ul>
            )}
        </li>
    );
};

export default Comment;

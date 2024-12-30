import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import InsertComment from './components/insertComment'
import Comment from './components/comment'
import ElementComponent from './components/createElement';
import ElementBuilder from './components/elementBuilder';
import CurrentUserContext from '../util/CurrentUserContext';
import ChangePrivacy from './components/micro_components/changePrivacyResourceDetails';
import PrivacyButton from './components/micro_components/PrivacyButton';
import ResourceScaler from '../custom_editor/util/resourceScaler';
import Modal from './components/general/modal';
import AddParentToResourceButton from './components/micro_components/addParentToResourceButton';
import CoolInput from './components/general/coolInput';


const ResourceDetails = ({ resource, displayConfig }) => {
    const [resourceMeta, setResourceMeta] = useState([]);
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);

    const currentUser = useContext(CurrentUserContext);

    const [isPrivate, setIsPrivate] = useState(resource.isPrivate)

    const [isModalOpen, setModalOpen] = useState(false);
    const [newTitle, setNewTitle] = useState(resource.title);

    const navigate = useNavigate();

console.log("MYRESOURCE", resource)

const findCommentInNested = (commentList, idToFind) => {
    for (let comment of commentList) {
        if (comment.id === idToFind) {
            return comment;
        }
        if (comment.reply_of_children && comment.reply_of_children.length > 0) {
            const foundComment = findCommentInNested(comment.reply_of_children, idToFind);
            if (foundComment) return foundComment;
        }
    }
    return null;
};

const handleNewComment = (newComment, replyTo = null) => {
    setComments(prevComments => {
        // If it's a top-level comment (not a reply), simply add it to the list
        if (!replyTo) {
            return [newComment,...prevComments ];
        }
console.log("COMMENTS:", newComment, prevComments)
        // Otherwise, it's a reply, so find the parent comment and update it
        const updatedComments = JSON.parse(JSON.stringify(prevComments)); // Deep copy to avoid direct state mutation

        const updateReplies = (comments) => {
            return comments.map(comment => {
                if (comment.id === replyTo) {
                    // Found the parent comment, add the new reply
                    return {
                        ...comment,
                        reply_of_children: [newComment,...(comment.reply_of_children || [])]
                    };
                } else if (comment.reply_of_children) {
                    // Recursively update nested replies
                    return {
                        ...comment,
                        reply_of_children: updateReplies(comment.reply_of_children)
                    };
                }
                return comment;
            });
        };

        return updateReplies(updatedComments);
    });
};


    useEffect(() => {
        
    },[comments])


    useEffect(() => {
        const fetchResourceDetails = async () => {
            try {
                console.log("THIS RESOURCE ", resource);
                const response = await fetch(`/api/resource-meta?resourceId=${resource.id}`);

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const data = await response.json();
                console.log(data)
                setResourceMeta(data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching resource details:", error);
                setLoading(false);
            }
        };

        fetchResourceDetails();
    }, [resource.id]);

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const response = await fetch(`/api/comments-for-resource?resourceId=${resource.id}`);

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const commentsData = await response.json();
                commentsData.sort((b, a) =>  new Date(b.created_at) - new Date(a.created_at));
                setComments(commentsData);
            } catch (error) {
                console.error("Error fetching comments:", error);
            }
        };

        fetchComments();
    }, [resource.id]);

    if (loading) {
        return <p>Loading resource details...</p>;
    }

    if (!resourceMeta.length) {
        return <p>No resource metadata found for the given ID.</p>;
    }


     const handleCopyResource = () => {
        // Construct the URL for the API call
        const apiUrl = `/api/copy-resource?resourceId=${resource.id}&newTitle=${newTitle}`;
        
        fetch(apiUrl, {
            method: 'GET', // Or 'POST', if your endpoint expects it
            credentials: 'include', // Include cookies if your API requires authentication
            // Additional headers as needed
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                //alert(`Resource copied successfully! New Resource ID: ${data.resourceId}`);
                // Close the modal
                navigate(`/editing/${data.resourceId}`);
                setModalOpen(false);
            } else {
                alert('Failed to copy the resource.');
            }
        })
        .catch(error => {
            console.error('Error copying resource:', error);
            alert('Error occurred while copying the resource.');
        });
    };



   


    const handleGeneratePdf = () => {
        // Construct the URL for the PDF generation
        let landscape = document.querySelector('.page-container').offsetHeight< 900 ? true : false;

    const apiUrl = `/api/generate-pdf?url=${window.location.href}&landscape=${landscape}`;
    // Use 'fetch' to call your backend endpoint
    // This example assumes you want to trigger a download directly
    fetch(apiUrl)
      .then(response => response.blob())
      .then(blob => {
        // Create a new object URL for the blob
        const url = window.URL.createObjectURL(blob);
        // Create a temporary link element and trigger a download
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `resource-${resource.id}.pdf`); // Set the file name for the download
        document.body.appendChild(link);
        link.click();
        // Clean up by revoking the object URL and removing the link element
        link.parentNode.removeChild(link);
        window.URL.revokeObjectURL(url);
      })
      .catch(error => {
        console.error('Error generating PDF:', error);
        alert('Failed to generate PDF. Please try again later.');
      });
    };
    
    const handleGenerateScreenshot = () => {
    // Use 'fetch' to call your backend endpoint for generating a screenshot
    const apiUrl = `/api/generate-screenshot?url=${encodeURIComponent(window.location.href)}`;

    fetch(apiUrl)
      .then(response => response.blob())
      .then(blob => {
        // Create a new object URL for the blob
        const url = window.URL.createObjectURL(blob);

        // Create a temporary link element and trigger a download
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `screenshot-${Date.now()}.png`); // Set the file name for the download
        document.body.appendChild(link);
        link.click();

        // Clean up by revoking the object URL and removing the link element
        window.URL.revokeObjectURL(url);
        document.body.removeChild(link);
      })
      .catch(error => {
        console.error('Error generating screenshot:', error);
        alert('Failed to generate screenshot. Please try again later.');
      });
};





    return (
        <>
            <div className='category-container-wrapper'>
            <h2>{resource.title}</h2>
            
                <p>By: {resource.author.firstname} {resource.author.lastname}</p>
                <div>
                <div style={{display: 'flex'}}>
                {(resource.created_by == currentUser.currentUser.id) ? <a className="edit-button"  href={`/editing/${resource.id}`}> Edit </a > : null}
                {(resource.created_by == currentUser.currentUser.id) ?<PrivacyButton resource={resource} onSubmit={setIsPrivate}/> : null}
                {(resource.created_by == currentUser.currentUser.id && isPrivate) ? <ChangePrivacy isPrivate={true} permissions={resource.permissions} resourceID={resource.id} resource={resource} /> :null}
                    </div>
                    <div style={{display: 'flex'}}>
                        {displayConfig.allowPDF && <button className='new-button' onClick={handleGeneratePdf}>
                            <svg fill="#000000" width="30x" height="30px" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg">

<path d="M30 20.75c-0.69 0.001-1.249 0.56-1.25 1.25v6.75h-25.5v-6.75c0-0.69-0.56-1.25-1.25-1.25s-1.25 0.56-1.25 1.25v0 8c0 0.69 0.56 1.25 1.25 1.25h28c0.69-0.001 1.249-0.56 1.25-1.25v-8c-0.001-0.69-0.56-1.249-1.25-1.25h-0zM15.116 24.885c0.012 0.012 0.029 0.016 0.041 0.027 0.103 0.099 0.223 0.18 0.356 0.239l0.008 0.003 0.001 0c0.141 0.060 0.306 0.095 0.478 0.095 0.345 0 0.657-0.139 0.883-0.365l5.001-5c0.226-0.226 0.366-0.539 0.366-0.884 0-0.691-0.56-1.251-1.251-1.251-0.345 0-0.658 0.14-0.884 0.366l-2.865 2.867v-18.982c0-0.69-0.56-1.25-1.25-1.25s-1.25 0.56-1.25 1.25v0 18.981l-2.866-2.866c-0.226-0.226-0.539-0.366-0.884-0.366-0.691 0-1.251 0.56-1.251 1.251 0 0.346 0.14 0.658 0.367 0.885v0z"></path>
</svg>
                            
                            <p>Downlaod PDF</p></button>}

                    {displayConfig.isCopyable && <button className='new-button' onClick={() => setModalOpen(true)}>
                        
                        <svg fill="#000000" width="30px" height="30px" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg">

<path d="M31.218 8.096c-0.008-0.059-0.018-0.112-0.033-0.163l0.002 0.008c-0.052-0.222-0.158-0.414-0.303-0.568l0.001 0.001-6.297-6.296c-0.155-0.146-0.349-0.252-0.564-0.302l-0.008-0.002c-0.042-0.012-0.094-0.023-0.147-0.030l-0.006-0.001c-0.044-0.013-0.098-0.024-0.154-0.031l-0.006-0.001h-9.445c-0.69 0-1.25 0.56-1.25 1.25v0 22.038c0 0.69 0.56 1.25 1.25 1.25h15.742c0.69-0.001 1.249-0.56 1.25-1.25v-15.742c-0.008-0.062-0.019-0.117-0.034-0.171l0.002 0.009zM24.953 4.979l2.029 2.028h-2.029zM15.508 22.75v-19.538h6.945v5.046c0 0.69 0.56 1.25 1.25 1.25h5.047v13.242zM17.742 26.75c-0.69 0-1.25 0.56-1.25 1.25v0.77h-13.242v-19.539h6.75c0.69 0 1.25-0.56 1.25-1.25s-0.56-1.25-1.25-1.25v0h-8c-0.69 0-1.25 0.56-1.25 1.25v0 22.039c0 0.69 0.56 1.25 1.25 1.25h15.742c0.69-0.001 1.249-0.56 1.25-1.25v-2.020c-0.001-0.69-0.56-1.249-1.25-1.25h-0z"></path>
</svg>
                        <p>Copy Resource </p></button>}
                    
                  { displayConfig.allowShareWithParents &&  <AddParentToResourceButton resourceId={resource.id} sosuUserId={currentUser.currentUser.id} />}
                  </div>
                    
                    </div>
                <div style={{position: 'relative'}}>
            <div className='resource-canvas'>
                
                
                  
                    { <ElementBuilder jsonData={resourceMeta}/>
                     }
                      
                        
                  
                    </div>
                    {displayConfig.zoomButtons &&  <ResourceScaler position={'absolute'} />}
                </div>
                {!displayConfig.doNotShowDescription &&
                <><h3 style={{textAlign: 'left', marginBottom: "5px"}}> Description </h3>
                    <p style={{ textAlign: 'left', marginTop: "0px" }}>{resource.description}</p> </>}
            <div>

                <InsertComment reply_to={null} resource_id={resource.id} unfolded={true} always_unfolded={true} onNewComment={handleNewComment} />
                <ul>
                    {comments.map(comment => (
                        <Comment
                        key={comment.id}  showButtons={displayConfig.noCommentTree && false }  comment={comment} resource_id={resource.id} onNewComment={handleNewComment}  collapseChildren={true}/>
                    ))}
                </ul>
            </div>
</div>
            
            <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
                <div>
                    <h2>Copy Resource</h2>
                    <p>By copying the resource you're making your own version that you can edit,
                        are you sure you want this?</p>
                   
                    <CoolInput label="New Title" onChange={setNewTitle} />
                    
                    <button onClick={handleCopyResource}>Copy</button>
                </div>
            </Modal>
        </>
    );
};

export default ResourceDetails;

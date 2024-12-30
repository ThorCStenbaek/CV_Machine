import React, { useState, useEffect, useContext } from 'react';
import ResourceList from './ResourceList'; // Adjust the import path as necessary
import Comment from './components/comment'; // Adjust the import path as necessary
import CurrentUserContext from '../util/CurrentUserContext'; // Adjust the import path as necessary
import NameInitialsAvatar from './components/micro_components/NameInitialsAvatar';
import { Link } from 'react-router-dom';
import PathsContext from '../util/PathsContext';
import AddUserForm from './components/users/createUser';


const UserProfileData = () => {
     const [userComments, setUserComments] = useState([]);
    const [userRatings, setUserRatings] = useState([]);
    const [userSavedResources, setUserSavedResources] = useState([]);
    const [userCreatedResources, setUserCreatedResources] = useState([]);
    // State for selected post type ID for each category
    const [selectedPostTypeIdForComments, setSelectedPostTypeIdForComments] = useState('');
    const [selectedPostTypeIdForRatings, setSelectedPostTypeIdForRatings] = useState('');
    const [selectedPostTypeIdForSaved, setSelectedPostTypeIdForSaved] = useState('');
    const [selectedPostTypeIdForCreated, setSelectedPostTypeIdForCreated] = useState('');

    const { currentUser } = useContext(CurrentUserContext);
    const [postTypes, setPostTypes] = useState([]);


    const { allPaths, setAllPaths } = useContext(PathsContext);





    const extractUniquePostTypes = (allItems) => {
    const allPostTypeInfos = allItems
        .map(item => item.postTypeInformation) // Extract postTypeInformation from each item
        .filter(Boolean); // Remove any undefined or null postTypeInformation entries

    // Reduce the array to unique post types based on the id
    const uniquePostTypes = allPostTypeInfos.reduce((acc, current) => {
        const x = acc.find(item => item.id === current.id);
        if (!x) {
            return acc.concat([current]);
        } else {
            return acc;
        }
    }, []);

    return uniquePostTypes;
};



    useEffect(() => {
        const fetchData = async () => {
            // Fetch user comments
            const commentsResponse = await fetch('/api/user-comments');
            const commentsData = await commentsResponse.json();
            setUserComments(commentsData);

            // Fetch user ratings
            const ratingsResponse = await fetch('/api/user-ratings');
            const ratingsData = await ratingsResponse.json();
            setUserRatings(ratingsData);

            // Fetch user saved resources
            const savedResourcesResponse = await fetch('/api/user-saved-resources');
            const savedResourcesData = await savedResourcesResponse.json();
            setUserSavedResources(savedResourcesData);

            // Fetch user created resources
            const createdResourcesResponse = await fetch('/api/user-created-resources');
            const createdResourcesData = await createdResourcesResponse.json();
            setUserCreatedResources(createdResourcesData);
        };
        fetchData();
    }, []);

    useEffect(() => {
        // Combine all items to extract post types
        const allItems = [...userComments, ...userRatings, ...userSavedResources, ...userCreatedResources];
        const extractedPostTypes = allItems
            .map(item => item.postTypeInformation)
            .filter((value, index, self) => value && self.findIndex(t => t.id === value.id) === index); // Ensure unique and defined post types
        setPostTypes(extractedPostTypes);
    }, [userComments, userRatings, userSavedResources, userCreatedResources]); // React to changes in any user data

 useEffect(() => {
        const allItems = [...userComments, ...userRatings, ...userSavedResources, ...userCreatedResources];
        const uniquePostTypes = extractUniquePostTypes(allItems);
        setPostTypes(uniquePostTypes);
    }, [userComments, userRatings, userSavedResources, userCreatedResources]);


    useEffect(() => {
        // Fetch or set your postTypes array here
        // setPostTypes(examplePostTypes); // Example placeholder
        
        // Automatically select the first post type as default when postTypes is updated
        if (postTypes.length > 0) {
            setSelectedPostTypeIdForComments(postTypes[0].id.toString())
     setSelectedPostTypeIdForRatings(postTypes[0].id.toString())
    setSelectedPostTypeIdForSaved(postTypes[0].id.toString())
    setSelectedPostTypeIdForCreated(postTypes[0].id.toString())

// Convert to string if necessary
        }
    }, [postTypes]);


            if (!currentUser) {
                console.log("UPS", currentUser, allPaths)
                window.location.reload()
        // Render a loading state or nothing if the context values aren't ready
        return <div>Loading user data...</div>;
    }


    // Rendering function adjusted for simplification
    const renderUserComments = (comments) => {
        console.log("inside render:", allPaths)
        console.log("comments:", comments)
        return comments.map(comment => (
  <React.Fragment key={comment.id}>
                {/*<Link to={`${allPaths.get(comment.resource_id)}#commentID${comment.id}`}>go to comment</Link> */}
                <div className='user-comments-resource-holder'>
                    <Link style={{textDecoration: "none"}} to={`${allPaths.get(comment.resource_id)}`}>
                    <div className='flex just-left crh-title'>
                            <p  className='flex just-left align-items-center' style={{margin: "0px"}}>
                                <NameInitialsAvatar firstName={currentUser.firstname} lastName={currentUser.lastname} color={currentUser.color}
                                    height="20px"
                                    width="20px"
                                    fontSize='10px'
                                />
                                <p style={{margin: "0px"}}>{currentUser.firstname} {currentUser.lastname} commented on</p>
                            
                                <b>{comment.title} </b></p>
                            •
                            { /*<p style={{ margin: "0px" }}>{comment.description}</p> •*/}
                            
                            <p className='flex just-left align-items-center' style={{ margin: "0px" }}>
                                posted by 
                                                                <NameInitialsAvatar firstName={comment.authorDetails.firstname} lastName={comment.authorDetails.lastname} color={comment.authorDetails.color}
                                    height="20px"
                                    width="20px"
                                    fontSize='10px'
                                />
                                <p style={{margin: "0px"}}>{comment.authorDetails.firstname} {comment.authorDetails.lastname}</p>

                            </p>
                        </div>
                    </Link>
                    <div style={{padding: "25px", paddingTop: "6px", paddingBottom: "2px"}}>
                        <Comment comment={comment} resource_id={comment.resource_id} onNewComment={() => { }} showButtons={false } />
                        </div>
                    </div>
  </React.Fragment>
));

    };

    const renderPostTypeSelect = (selectedPostTypeId, setSelectedPostTypeId, label) =>
    {
      

        return (
        <>
           
            <div className='profile-box-title' >
                    <h2 style={{color: 'white'}}>{label}: </h2>
                    </div>
                    <div>
                {postTypes.map(postType => (
                    <button key={postType.id}
                    style={{
                            backgroundColor: postType.id.toString() === selectedPostTypeId ? '#4CAF50' : '#f2f2f2',
                            color: postType.id.toString() === selectedPostTypeId ? 'white' : 'black', // Optional: changing text color for contrast
                            margin: '0px', // Example spacing
                            border: 'none', // Example style
                            padding: '10px 20px', // Example padding
                        cursor: 'pointer', // Changes cursor to pointer on hover
                            width: `${postTypes.length > 1 ? 100 / postTypes.length : 100}%`, // Adjusts button width based on number of post types
                        borderRadius: '0px'
                        
                        }}

                        value={postType.id} onClick={() => setSelectedPostTypeId(postType.id.toString())}>
                        {postType.name} ({postType.post_name_plural})
                    </button>
                ))}
            </div>
        </>
    );
    }

    const displayConfig= { 
                    title: true, 
                     categoryName: true,
        description: true, 
        author: true, 
        date: true, 
        userRating: true,
        comments: true,
        status: true,
        savedByUser: true
    }

     return (
         <div>
             

                <div className='outer-profile-box'>  
            {renderPostTypeSelect(selectedPostTypeIdForComments, setSelectedPostTypeIdForComments, "Your Comments")}
            {/* Filter and render comments based on selectedPostTypeIdForComments */}

            <div className='profile-box'>  
            { renderUserComments(userComments.filter(comment => comment.postTypeInformation.id.toString() === selectedPostTypeIdForComments)) }
            </div>
            </div>
                 

             <div className='outer-profile-box'>  
            {renderPostTypeSelect(selectedPostTypeIdForRatings, setSelectedPostTypeIdForRatings, "Rated posts")}
            {/* Filter and render ratings based on selectedPostTypeIdForRatings */}
          
             <div className='profile-box'>  
            <ResourceList resources={userRatings.filter(rating => rating.postTypeInformation.id.toString() === selectedPostTypeIdForRatings)} displayConfig={displayConfig} />
                 </div>      
             </div>    
            <div className='outer-profile-box'>   
            {renderPostTypeSelect(selectedPostTypeIdForSaved, setSelectedPostTypeIdForSaved, "Saved posts")}
            {/* Filter and render saved resources based on selectedPostTypeIdForSaved */}
       
            <div className='profile-box'>  
            <ResourceList resources={userSavedResources.filter(resource => resource.postTypeInformation.id.toString() === selectedPostTypeIdForSaved)}  displayConfig={displayConfig} />
            </div>
            </div>
            <div className='outer-profile-box'>  
            {renderPostTypeSelect(selectedPostTypeIdForCreated, setSelectedPostTypeIdForCreated, "Your posts")}
            {/* Filter and render created resources based on selectedPostTypeIdForCreated */}
     
            <div className='profile-box'>  
            <ResourceList resources={userCreatedResources.filter(resource => resource.postTypeInformation.id.toString() === selectedPostTypeIdForCreated)} displayConfig={displayConfig}  />
            </div>
            </div>


            <AddUserForm onhandleSubmit={()=>window.alert("User created")} />
             
             
             </div>
    );
};

export default UserProfileData;

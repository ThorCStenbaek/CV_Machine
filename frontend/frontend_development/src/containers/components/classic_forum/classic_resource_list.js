import { useState, useEffect } from 'react'; 
import React,{useContext } from 'react'; 
import { Link } from 'react-router-dom';
import InteractiveSVG from '../starSVG';
import HeartIcon from '../heartSVG';
import StatusDisplay from '../StatusDisplay';
import PathsContext from '../../../util/PathsContext';

const TableRow = ({ resource, currentPath, postType, resourceID, displayConfig, colors }) => {
    const [currentRating, setCurrentRating] = useState(resource.ratings.meanRating);
    const [currentUserRating, setCurrentUserRating] = useState(resource.ratings.userRating);
    const [totalUsersRated, setTotalUsersRated] = useState(resource.ratings.totalUsersRated); // Initial state
    const { allPaths, setAllPaths } = useContext(PathsContext);
  //for heart
  const [userHasSaved, setUserHasSaved] = useState(resource.userHasSaved);

    console.log("resource: ", resource)
    console.log("innerPaths",allPaths)
const handleSVGClick = async (starNumber) => {

const pastRatings=currentRating*totalUsersRated
  if (!resource.ratings.userRating) {
    resource.ratings.userRating = starNumber;
    setTotalUsersRated(prevCount => prevCount + 1); // Increment the totalUsersRated count
    }
    
    setCurrentUserRating((pastRatings+currentUserRating)/totalUsersRated);
        setCurrentRating(starNumber);
    

        // Call the API to insert/update the rating
        try {
            const response = await fetch('/api/insert-rating', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // Include any other headers, like authentication tokens, if needed
                },
                body: JSON.stringify({
                    resourceId: resource.id, // Assuming resource object has an id property
                    ratingValue: starNumber
                })
            });

            const data = await response.json();

            if (data.success) {
                console.log('Rating inserted/updated successfully with rating ID:', data.ratingId);
            } else {
                console.error('Failed to insert/update rating.');
            }
        } catch (error) {
            console.error('Error calling /api/insert-rating:', error);
        }
    
};


const handleHeartToggle = async (newSavedStatus) => {
    setUserHasSaved(newSavedStatus);

    // If the newSavedStatus is false, we might not want to call the API. 
    // This depends on whether you want to remove the saved resource when the heart is toggled off.
    if (!newSavedStatus) {
        return;
    }

    // Call the API to save the resource for the user
    try {

        const response = await fetch('/api/save-resource', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                resourceId: resource.id
            })
        });

        const data = await response.json();
        console.log("saving resource")
        if (!data.success) {
            console.error('Failed to save resource for user.');
        }
    } catch (error) {
        console.error('Error calling /api/save-resource:', error);
    }
};



return (
        <tr key={resource.id}>
        {displayConfig.title && <td>
            <div style={{display: 'flex', flexDirection: 'column', textAlign: 'left'}}>
                <Link to={allPaths.get(resource.id)}>{resource.title}</Link>

                                     <div style={{display: 'flex', alignItems: 'center', gap: '2px'}}>
                    <div style={{ height: "15px", width: "15px", background: colors[resource.category_id] }}> </div>
                <p> {displayConfig.categoryName && resource.categoryName}</p> </div>
                <p>  {displayConfig.description && resource.description}</p>
            </div>
        
        </td>}
     

            {displayConfig.author && <td>{resource.author.firstname} {resource.author.lastname}</td>}
            {displayConfig.date && <td>{resource.created_at.split(" ")[0]}</td>}
            {displayConfig.userRating && (
                <td>
                    <InteractiveSVG 
                        totalStars={5} 
                        fillStars={currentRating} 
                        currentUserRating={currentUserRating}
                        onClick={handleSVGClick}
                        totalUsersRated={totalUsersRated}
                        setTotalUsersRated={setTotalUsersRated}
                    />
                </td>
            )}
            {displayConfig.comments && <td>{resource.commentCount}</td>}
        {displayConfig.status && <td><StatusDisplay
            resource={resource} status={resource.status} isPrivate={resource.isPrivate} permissions={resource.permissions} resourceID={resourceID} /></td>}
            {displayConfig.savedByUser && <td><HeartIcon isSaved={userHasSaved} onToggle={handleHeartToggle} /></td>}
        </tr>
    );
}





















// ResourceList Component
const ClassicResourceList = ({ resources, currentPath, postType, displayConfig, colors }) => {
    console.log("RES", resources)
    if (!resources || resources.length === 0) {
        return <p>No resources available.</p>;
    }

   return (
        <>
            <div>

                <table>
                    <thead>
                        <tr>
                           {displayConfig.title && <th>Title</th>}
                           
                            {displayConfig.author && <th>Author</th>}
                            {displayConfig.date && <th>Date</th>}
                            {displayConfig.userRating && <th>User Rating</th>}
                            {displayConfig.comments && <th>Comments</th>}
                            {displayConfig.status && <th>Status</th>}
                            {displayConfig.savedByUser && <th>Saved by User</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {resources.map(resource => (
                            <TableRow 
                                key={resource.id} 
                                resource={resource} 
                                currentPath={currentPath} 
                                postType={postType} 
                                resourceID={resource.id} 
                                displayConfig={displayConfig} 
                                colors={colors}
                            />
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
};

export default ClassicResourceList;
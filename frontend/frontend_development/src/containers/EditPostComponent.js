import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';

import CurrentUserContext from '../util/CurrentUserContext';
import CustomEditor from '../custom_editor/CustomEditor';
import NewResourceComponent from './components/newResource';


const EditPostComponent = () => {
  const [resource, setResource] = useState(null);
  const [resourceMeta, setResourceMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [permission, setPermission] = useState(false);

  const currentUser = useContext(CurrentUserContext);
  const { postID } = useParams();

  useEffect(() => {
    const fetchResourceDetails = async () => {
      setLoading(true);
      try {
        const resourceResponse = await fetch(`/api/resource/${postID}`);
        if (!resourceResponse.ok) {
          throw new Error(`HTTP error! Status: ${resourceResponse.status}`);
        }
        const resourceData = await resourceResponse.json();
        console.log("PERM: ", currentUser, resourceData)
        if (currentUser.currentUser.id === resourceData.created_by) {
          setPermission(true);

          // Fetch resourceMeta if permission is granted
          const metaResponse = await fetch(`/api/resource-meta?resourceId=${postID}`);
          if (!metaResponse.ok) {
            throw new Error(`HTTP error! Status: ${metaResponse.status}`);
          }
          const metaData = await metaResponse.json();
            setResourceMeta(metaData);
            console.log("PERM: ", metaData)
        } else {
          setPermission(false);
        }
        
        setResource(resourceData);
      } catch (error) {
        console.error("Error fetching resource details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResourceDetails();
  }, [postID, currentUser.id]); // Adding currentUser.id to the dependency array

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!permission) {
    return <div>Permission denied.</div>;
  }

  // Assuming resourceMeta should not be null to proceed
  if (!resourceMeta) {
    return <div>Resource meta not found.</div>;
  }

  // Conditional rendering based on editor_used
  if (resource.editor_used === 3) {
    return <CustomEditor resource={resource} givenResourceMeta={resourceMeta} />;
  }
  if (resource.editor_used === 2) {
    return <NewResourceComponent postType={resource.postTypeInformation} resource={resource} resourceMeta={resourceMeta} />;
  }

  // Default rendering if none of the above conditions are met
  return (
    <div>
      <h2>Editing Resource: {resource.title}</h2>
      <p>{resource.description}</p>
      {/* Render additional UI elements for editing as needed */}
    </div>
  );
};

export default EditPostComponent;

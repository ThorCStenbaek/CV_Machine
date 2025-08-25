import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiEdit2, FiCopy, FiDownload, FiEye, FiEyeOff, FiShare2,FiPlus } from 'react-icons/fi';

import CurrentUserContext from '../../util/CurrentUserContext';
import PrivacyButton from '../../containers/components/micro_components/PrivacyButton';
import ChangePrivacy from '../../containers/components/micro_components/changePrivacyResourceDetails';
import Modal from '../../containers/components/general/modal';
import styles from "./../../css/pages/YourCVs.module.css";

export const YourCVs = ({ displayConfig }) => {
  const [resources, setResources] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [selectedResource, setSelectedResource] = useState(null);

  const { currentUser } = useContext(CurrentUserContext);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("CVS:", resources)
  }, [resources]);

  useEffect(() => {
    fetch('/api/user-created-resources?withMeta=true')
      .then(response => response.json())
      .then(data => setResources(data))
      .catch(error => console.error('Error fetching resources:', error));
  }, []);

  const handleGeneratePdf = (resource) => {
    const landscape = window.innerHeight < 900;
    const apiUrl = `/api/generate-pdf?id=${resource.id}&landscape=${landscape}`;
    fetch(apiUrl)
      .then(res => res.blob())
      .then(blob => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `resource-${resource.id}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(url);
      })
      .catch(err => console.error('PDF generation failed:', err));
  };

  const handleCopyClick = (resource) => {
    setSelectedResource(resource);
    setNewTitle(resource.title);
    setModalOpen(true);
  };

  const handleCopyResource = () => {
    if (!selectedResource) return;
    fetch(
      `/api/copy-resource?resourceId=${selectedResource.id}&newTitle=${encodeURIComponent(newTitle)}`
    )
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          navigate(`/editing/${data.resourceId}`);
          setModalOpen(false);
        } else {
          alert('Failed to copy resource.');
        }
      })
      .catch(err => console.error('Copy failed:', err));
  };

  if (!resources) {
    return <div>Loading...</div>;
  }
  console.log("STYLES:", styles)

  return (
    <div className={styles.cvContainer}>
        <button className={styles.addCVButton} onClick={() => navigate('/add_new/1')}>
          <FiPlus />
          Create New CV
        </button>
      <div className={styles.cvGrid}>
        {resources.map(resource => (
          <div key={resource.id} //className={styles.cvCard}
          >
            <div className={styles.cvPreview} >
            {resource.screenshot && (
                <img 
                src={resource.screenshot} 
                alt={`Preview of ${resource.title}`} 
                className={styles.resourcePreview}
                style={{
                    maxWidth: '100%',
                    maxHeight: '100%',
                    objectFit: 'contain',
                    border: "lightgrey 1px solid",
                    borderRadius: "5px"
                }}
                />
                
            )}

    <div className={styles.cvCover}>

              



            <div className={styles.cvActions}>

              
              {/*resource.created_by === currentUser.id && (
                <PrivacyButton
                  resource={resource}
                  onSubmit={() => {}}
                  icon={resource.isPrivate ? <FiEyeOff /> : <FiEye />}
                  className={styles.cvAction}
                />
              ) */}
              
              {/* resource.created_by === currentUser.id && resource.isPrivate && (
                <ChangePrivacy
                  isPrivate={true}
                  permissions={resource.permissions}
                  resourceID={resource.id}
                  resource={resource}
                  icon={<FiShare2 />}
                  className={styles.cvAction}
                />
              ) */}

                {resource.created_by === currentUser.id && (
                <button onClick={() => navigate(`/editing/${resource.id}`)} className={styles.cvAction} title="Edit">
                  <FiEdit2 />
                </button>
              )}
              
              <button 
                onClick={() => handleGeneratePdf(resource)} 
                className={styles.cvAction} 
                title="Download PDF"
              >
                <FiDownload  />
              </button>
              
              <button 
                onClick={() => handleCopyClick(resource)} 
                className={styles.cvAction} 
                title="Copy"
              >
                <FiCopy  />
              </button>
            </div>


                 </div>
            </div>
            {/*
            <div className={styles.cvInfo}>
              <h3 className={styles.cvTitle}>{resource.title}</h3>
              <p className={styles.cvDate}>{resource.created_at.split(' ')[0]}</p>
            </div>
            */ }
<div style={{textAlign: "left", width: "100%"}}> 
<div className={styles.cvTitle}> {resource.title} </div>
<div className={styles.cvDate}> {resource.created_at} </div>
              </div>
          </div>
        ))}
      </div>

      {selectedResource && (
        <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
          <h2>Copy Resource</h2>
          <p>
            By copying, you'll create your own editable version. Please confirm the
            new title:
          </p>
          <input
            type="text"
            value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
          />
          <button onClick={handleCopyResource} className="btn">
            Confirm Copy
          </button>
        </Modal>
      )}
    </div>
  );
};

export default YourCVs;
import React, { useState } from 'react';
import Modal from '../general/modal';

const UserRow = ({ user, setSelectedGroup, setModalOpen, setSelectedUser, displayConfig, onAction  }) => {
      const [showModal, setShowModal] = useState(false);
    const [actionInput, setActionInput] = useState('');



const handleActionClick = () => {
        if (displayConfig.requireConfirmation) {
            setShowModal(true);
        } else {
            onAction(user, null, () => {}); // Directly perform the action without modal
        }
    };

    const handleActionConfirm = () => {
        onAction(user, actionInput, () => setShowModal(false));
    };


    return (
        <>
            <tr key={user.userId}>
                {displayConfig.username && <td>{user.username}</td>}
                {displayConfig.email && <td>{user.email}</td>}
                {displayConfig.firstname && <td>{user.firstname}</td>}
                {displayConfig.lastname && <td>{user.lastname}</td>}
                {displayConfig.userGroups && (
                    <td>
                        {user.userGroups.map(group => (
                            <>
                            <span className='pressable-link'
                                key={group.groupId} 
                                onClick={() => {
                                    setSelectedGroup(group);
                                    setModalOpen(true);
                                    setSelectedUser(user.userId)
                                }}
                            >
                                {group.groupName}, 
                            </span>    <span> </span>
                        </>
                        ))}
                    </td>
                )}
                {displayConfig.userRole && <td>{user.userRole.roleName}</td>}
                { (displayConfig.showActionButton) ?
                <td>
                    <button onClick={handleActionClick}>{displayConfig.actionButtonLabel || 'Action'}</button>
                </td> : null
                }
            </tr>

                        {displayConfig.requireConfirmation && (
                <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
                    {displayConfig.modalContent && displayConfig.modalContent(user, actionInput, setActionInput)}
                    <button onClick={handleActionConfirm}>{displayConfig.actionConfirmButtonLabel || 'Confirm'}</button>
                    <button onClick={() => setShowModal(false)}>Cancel</button>
                </Modal>
            )}
        </>
    );
};

export default UserRow;



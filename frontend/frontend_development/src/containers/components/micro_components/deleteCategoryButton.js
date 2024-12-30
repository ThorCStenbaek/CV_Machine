import React, { useState } from 'react';
import Modal from '../general/modal'; // Adjust the import path accordingly
import CategorySelect from './categorySelect'; // Adjust the import path accordingly

const DeleteCategoryButton = ({ categoryID, onDelete }) => {
    const [isModalOpen, setModalOpen] = useState(false);
    const [newParentId, setNewParentId] = useState(null);

    console.log("in delte button", categoryID)
    const handleDeleteClick = () => {
        setModalOpen(true);
    };

    const handleConfirmDelete = () => {
        setModalOpen(false);
        if (onDelete) {
            onDelete(categoryID, newParentId);
        }
    };

    return (
        <div>
            <button onClick={handleDeleteClick}>Delete Category</button>
            <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
                <h2>Are you sure you want to delete this category?</h2>
                <p>Please select a new parent for its subcategories (if any):</p>
                <CategorySelect 
                    categoryId={newParentId} 
                    onCategoryChange={setNewParentId}
                    hasNull={true}
                />
                <button onClick={handleConfirmDelete}>Confirm Delete</button>
                <button onClick={() => setModalOpen(false)}>Cancel</button>
            </Modal>
        </div>
    );
};

export default DeleteCategoryButton;

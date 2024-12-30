import React, { useState, useEffect } from 'react';
import ImageWithModal from './imageWithModal';


const ImageGallery = ({ images, loading, error, onImageSelect, displayConfig, allImageCategories }) => {
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  console.log("IMAGE INSIDE ImageGallery", images)
  const handleImageSelect = (selectedImage) => {
    onImageSelect(selectedImage);
  };

  return (
    <div className="image-gallery">
      {images.map(image => (
        <ImageWithModal
          key={image.ID}
          image={image}
          onSelectImage={handleImageSelect}
          displayConfig={displayConfig}
          allImageCategories={allImageCategories}
        />
      ))}
    </div>
  );
};

export default ImageGallery;

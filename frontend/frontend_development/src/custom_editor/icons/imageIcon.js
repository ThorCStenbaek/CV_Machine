import React from 'react';

const PictureIcon = ({ onClick, size="30px" }) => {
    return (
        <svg
            viewBox="0 0 512 512" // Set the viewBox as per the SVG file
            xmlns="http://www.w3.org/2000/svg"
            onClick={onClick}
            style={{ cursor: 'pointer', height: size, width: size, fill: 'inherit' }} // Adjust size as needed
        >
           <g>
                <path d="M31.5,34.5v443h449v-443H31.5z M57.5,61.5h399v316.478l-57.26-99.177L323,146.747l-76.24,132.053l-23.813,41.246   l-0.706-1.223L179.5,244.795l-42.741,74.029L98.264,385.5H57.5V61.5z"/>
                <circle cx="139" cy="133" r="40.5"/>
            </g>
        </svg>
    );
};

export default PictureIcon;

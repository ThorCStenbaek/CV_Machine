import React from 'react';

const HeartIcon = ({ isSaved, onToggle }) => {
    const handleClick = () => {
        onToggle(!isSaved);
    };

    const fillColor = isSaved ? 'firebrick' : 'white';

    return (
        <svg
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            onClick={handleClick}
            style={{ cursor: 'pointer', height: '30px', width: '30px' }} // Adjust size as needed
        >
            <g id="SVGRepo_bgCarrier" strokeWidth="3"></g>
            <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
            <g id="SVGRepo_iconCarrier">
                <path 
                    d="M14 20.408c-.492.308-.903.546-1.192.709-.153.086-.308.17-.463.252h-.002a.75.75 0 01-.686 0 16.709 16.709 0 01-.465-.252 31.147 31.147 0 01-4.803-3.34C3.8 15.572 1 12.331 1 8.513 1 5.052 3.829 2.5 6.736 2.5 9.03 2.5 10.881 3.726 12 5.605 13.12 3.726 14.97 2.5 17.264 2.5 20.17 2.5 23 5.052 23 8.514c0 3.818-2.801 7.06-5.389 9.262A31.146 31.146 0 0114 20.408z"
                    fill={fillColor}
                    stroke="#000000" // Adjust stroke color as needed
                    strokeWidth="1"   // Adjust stroke width as needed
                />
            </g>
        </svg>
    );
};



export default HeartIcon;

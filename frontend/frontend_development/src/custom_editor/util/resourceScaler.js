import React, { useState, useEffect } from 'react';

const ResourceScaler = ({position='fixed'}) => {
    const [scale, setScale] = useState(1); // Starting scale is 1
    const [margin, setMargin] = useState(5); // Starting margin is 5%

    // Function to increase scale and margin
   const increaseScale = () => {
        setScale(prevScale => {
            const newScale = prevScale + 0.1;
            // Update margin based on the newScale calculation directly
            setMargin(prevMargin => newScale >= 1.01 ? prevMargin + 10 : 5); // Add 10% to the margin or reset to 5%
            return newScale;
        });
    };

    // Function to decrease scale and margin, but keep margin at minimum 5%
    const decreaseScale = () => {
        setScale(prevScale => {
            const newScale = Math.max(0.1, prevScale - 0.1);
            // Update margin based on the newScale calculation directly
            setMargin(prevMargin => newScale <= 1.0 ? 5 : Math.max(5, prevMargin - 10)); // Remove 10% from the margin or reset to minimum of 5%
            return newScale;
        });
    };

    // Apply the scale transformation and adjust margins for elements with class 'resource-elements'
    useEffect(() => {
        const elements = document.querySelectorAll('.resource-elements');
        elements.forEach(el => {
            el.style.transform = `scale(${scale})`;
            el.style.marginRight = `${margin}%`;
            el.style.marginBottom = `${margin}%`;
        });
    }, [scale, margin]); // Re-apply when scale or margin changes

    // Event listener for ctrl+wheel
    useEffect(() => {
        const handleWheel = (event) => {
            if (event.ctrlKey) {
                event.preventDefault(); // Prevent the default zoom behavior
                event.deltaY < 0 ? increaseScale() : decreaseScale();
            }
        };

        document.querySelectorAll('.resource-elements').forEach(el => {
            el.addEventListener('wheel', handleWheel);
        });

        return () => {
            document.querySelectorAll('.resource-elements').forEach(el => {
                el.removeEventListener('wheel', handleWheel);
            });
        };
    }, []); // Set up once

const zoomStyles = {
    background: 'white', // Light gray background
    color: 'darkblue', // Text color
    fontSize: '30px', // Font size
    padding: '10px 20px', // Padding to make it round, adjust based on your preference
    border: 'none', // Remove default border
    borderRadius: '50px', // Large border radius to create rounded edges
    cursor: 'pointer', // Cursor pointer to indicate it's clickable
    outline: 'none', // Remove focus outline
    boxShadow: 'rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px', // Optional: Add a subtle shadow to elevate the button visually
    transition: 'background-color 0.3s', // Smooth transition for hover effect
    width: '55px'
};

    return (
        <div className="resource-scaler-buttons" style={{position: `${position}`, }}>
            <button style={zoomStyles} onClick={increaseScale}>+</button>
            <button style={zoomStyles} onClick={decreaseScale}>-</button>
            <span> Zoom: {Math.round(scale.toFixed(1)*100)}%</span>
        </div>
    );
}

export default ResourceScaler;

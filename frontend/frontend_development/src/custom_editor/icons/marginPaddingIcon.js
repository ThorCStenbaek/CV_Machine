import React, { useState, useEffect } from 'react';
import svg1 from "./svgs/marginPaddingFilled.svg";
import svg2 from "./svgs/marginPaddingUnfilled.svg";

const MarginPaddingIcon = ({ chosen, size = "50" }) => {
    const [hasGrid, setHasGrid] = useState(chosen);

    useEffect(() => {
        setHasGrid(chosen);
    }, [chosen]);

    const handleClick = () => {
        setHasGrid(!hasGrid);
        // onclick(!hasGrid);
    };

    return (
        <div className="grid-icon" onClick={handleClick}>
            {hasGrid ? (
                <img 
                    src={svg2} 
                    alt="Margin/Padding Filled" 
                    width={size} 
                    height={size}
                />
            ) : (
                <img 
                    src={svg1} 
                    alt="Margin/Padding Unfilled" 
                    width={size} 
                    height={size}
                />
            )}
        </div>
    );
};

export default MarginPaddingIcon;
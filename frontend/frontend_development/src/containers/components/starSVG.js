import React, { useState } from 'react';

const Star = ({ outerFill, innerFill, x, starNumber, onClick, onMouseEnter, onMouseLeave,  }) => (
    <svg 
        class="pointer"
    xmlns="http://www.w3.org/2000/svg" 
    xmlSpace="preserve" 
    width="25" 
    height="25" 
    x={x} 
    y="0" 
    viewBox="0 0 60 60" 
    onClick={() => onClick(starNumber)}
    onMouseEnter={() => onMouseEnter(starNumber)}
    onMouseLeave={onMouseLeave}
  >
    <path fill={outerFill || "gold"} d="M30 0L38.392 19.906H60L44.196 32.344L52.588 52.25L30 39.812L7.412 52.25L15.804 32.344L0 19.906H21.608L30 0z"/>
    <path fill={innerFill || "gold"} d="M30 6.6L37.794 22.336H54.18L41.487 32.664L49.281 48.4L30 37.072L10.719 48.4L18.513 32.664L5.82 22.336H22.206L30 6.6z"/>
  </svg>
);

// InteractiveSVG Component
const InteractiveSVG = ({ totalStars, outerFill, innerFill,fillStars, totalUsersRated, setTotalUsersRated, onClick, currentUserRating }) => {
  const [filledStars, setFilledStars] = useState(fillStars || 0);
  const [userRating, setUserRating]= useState(currentUserRating || 0)
  const [hoveredStar, setHoveredStar] = useState(null);
  const [totalReviews, setTotalReviews]= useState(totalUsersRated || 0)
    console.log("fill star", filledStars)
const handleStarClick = (starNumber) => {
    let newTotalReviews = totalReviews;
    let pastRatings = filledStars * totalReviews;

    if (userRating === 0) {
        newTotalReviews += 1; // Increment the totalUsersRated count if it's the user's first rating
        setTotalReviews(newTotalReviews);
    } else {
        // If the user has already rated, we need to subtract their previous rating from the pastRatings
        pastRatings -= userRating;
    }

    const newAverageRating = (pastRatings + starNumber) / newTotalReviews;

    setUserRating(starNumber);
    setFilledStars(newAverageRating);
    onClick(starNumber); // Callback with the new rating
};


  const handleStarMouseEnter = (starNumber) => {
    setHoveredStar(starNumber);
  };

  const handleStarMouseLeave = () => {
    setHoveredStar(null);
  };

  return (
    <>
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        xmlSpace="preserve" 
        width={25 * totalStars} 
        height="25" 
        viewBox={`0 0 ${25 * totalStars} 25`}
      >
        {Array.from({ length: totalStars }).map((_, index) => (
          <Star 
            key={index} 
            x={index * 25} 
            outerFill={(index < userRating || index < hoveredStar) ?  "blue": innerFill} 
            innerFill={(index < filledStars || index < hoveredStar) ? innerFill : "#FFF"} 
            starNumber={index + 1} 
            onClick={handleStarClick}
            onMouseEnter={handleStarMouseEnter}
            onMouseLeave={handleStarMouseLeave}
          />
        ))}
          </svg>
           <span> ({totalUsersRated})</span>

    </>
  );
};


export default InteractiveSVG;

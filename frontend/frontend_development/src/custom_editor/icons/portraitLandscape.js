
import React,{useState, useEffect} from 'react';

// The CustomSVG component accepts a className for styling and degrees for rotation.
const PortraitLandscapeSVG = ({  degrees = 0, onclick, chosen, size="50" }) => {
    // Inline style for rotating the SVG based on the degrees prop.
    const [isChosen, setIsChosen] = useState(chosen)
    useEffect(() => {
        setIsChosen(chosen)
    }, [chosen])

  const rotationStyle = {
      transform: (isChosen ?  `rotate(${0}deg)`:`rotate(${degrees}deg)`) ,
      display: 'inline-block',
      height:`${size}px`,
      width:`${size}px`, 
      cursor: 'pointer',
        //background: isChosen ? 'lightgrey' : 'white',
    };
    const handleClick = () => { 
        setIsChosen(true)
        onclick()
    }

  return (
    <div style={rotationStyle} onClick={handleClick} >
          <svg version="1.1" viewBox="0 0 1600 1600" width={size} height={size} xmlns="http://www.w3.org/2000/svg">
        <path transform="translate(82,80)" d="m0 0h742v2h8v-2h6v2h2v90h-2v588h680v2h2v502h-2v250h2v4h-316v2h-422v-2h-268v2h-4v-2h-2v2h-2v-2h-4v2h-22v-2h-8v2h-10v-2h-12v2h-2v-2h-24v2h-2v-2h-22v-318h-2v-2h-288v2h-2v-2h-2v2h-10v-2h-16v-1116h2v-2zm80 78v2h-2v58h-2v188h2v124h-2v590h242v-358h2v-2h358v-600h-2v-2h-366v2h-100v-2h-80v2h-30v-2h-20zm320 680v2h-2v58h-2v182h2v4h-2v2h2v2h-2v4h2v10h-2v4h2v10h-2v2h2v2h-2v2h2v58h-2v174h2v2h-2v84h962v-600h-2v-2h-908v2h-6v-2h-4v2h-18v-2h-20z" fill="#000002"/>
       <path transform="translate(1042,160)" d="m0 0h16v2h26v2h16v2h12v2h10v2h10v2h8v2h8v2h6v2h8v2h6v2h6v2h4v2h6v2h4v2h6v2h4v2h4v2h6v2h4v2h4v2h4v2h4v2h4v2h4v2h2v2h4v2h4v2h2v2h4v2h4v2h2v2h4v2h2v2h4v2h2v2h4v2h2v2h2v2h4v2h2v2h2v2h4v2h2v2h2v2h4v2h2v2h2v2h2v2h2v2h2v2h2v2h4v2h2v2h2v2h2v2h2v2h2v2h2v2h2v2h2v2h2v2h2v2h2v2h2v2h2v2h2v4h2v2h2v2h2v2h2v2h2v2h2v4h2v2h2v2h2v4h2v2h2v2h2v4h2v2h2v2h2v4h2v2h2v4h2v2h2v4h2v2h2v4h2v4h2v2h2v4h2v4h2v4h2v4h2v2h2v4h2v6h2v2h2v6h2v4h2v4h2v6h2v4h2v6h2v6h2v4h2v6h2v6h2v8h2v8h2v6h2v8h2v10h2v12h2v12h2v18h2v34h2v4h78v4h-4v2h-2v2h-2v2h-2v2h-2v2h-2v2h-2v2h-2v2h-2v2h-2v2h-2v2h-2v2h-2v2h-2v2h-2v2h-2v2h-2v2h-2v2h-2v2h-2v2h-2v2h-2v2h-2v2h-2v2h-2v2h-2v2h-2v2h-2v2h-2v2h-2v2h-2v2h-2v2h-2v2h-2v2h-2v2h-2v2h-2v2h-2v2h-2v2h-2v2h-2v2h-2v2h-2v2h-2v2h-2v2h-2v2h-2v2h-2v2h-2v2h-2v2h-2v2h-2v2h-2v2h-2v2h-2v2h-2v2h-2v2h-4v-2h-2v-2h-2v-2h-2v-2h-2v-2h-2v-2h-2v-2h-2v-2h-2v-2h-2v-2h-2v-2h-2v-2h-2v-2h-2v-2h-2v-2h-2v-2h-2v-2h-2v-2h-2v-2h-2v-2h-2v-2h-2v-2h-2v-2h-2v-2h-2v-2h-2v-2h-2v-2h-2v-2h-2v-2h-2v-2h-2v-2h-2v-2h-2v-2h-2v-2h-2v-2h-2v-2h-2v-2h-2v-2h-2v-2h-2v-2h-2v-2h-2v-2h-2v-2h-2v-2h-2v-2h-2v-2h-2v-2h-2v-2h-2v-2h-2v-2h-2v-2h-2v-2h-2v-2h-2v-2h-2v-2h-4v-2h-2v-2h-2v-4h78v-22h-2v-18h-2v-14h-2v-12h-2v-8h-2v-8h-2v-8h-2v-6h-2v-6h-2v-6h-2v-6h-2v-4h-2v-6h-2v-4h-2v-6h-2v-4h-2v-4h-2v-4h-2v-4h-2v-4h-2v-4h-2v-2h-2v-4h-2v-4h-2v-2h-2v-4h-2v-2h-2v-4h-2v-4h-2v-2h-2v-2h-2v-4h-2v-2h-2v-2h-2v-4h-2v-2h-2v-2h-2v-2h-2v-2h-2v-4h-2v-2h-2v-2h-2v-2h-2v-2h-2v-2h-2v-2h-2v-2h-2v-2h-2v-2h-2v-2h-2v-2h-2v-2h-2v-2h-2v-2h-2v-2h-4v-2h-2v-2h-2v-2h-2v-2h-2v-2h-4v-2h-2v-2h-2v-2h-4v-2h-2v-2h-2v-2h-4v-2h-2v-2h-4v-2h-2v-2h-4v-2h-4v-2h-2v-2h-4v-2h-4v-2h-4v-2h-4v-2h-4v-2h-4v-2h-4v-2h-4v-2h-4v-2h-6v-2h-4v-2h-6v-2h-6v-2h-4v-2h-8v-2h-6v-2h-8v-2h-8v-2h-8v-2h-14v-2h-14v-2h-20v-2h-14v-76h2v-2z" fill="#000002"/>
          </svg>
          </div>)
      
}
      
export default PortraitLandscapeSVG;
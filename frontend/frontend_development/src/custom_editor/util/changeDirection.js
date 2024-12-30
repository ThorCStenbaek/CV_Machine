import React, { useState } from "react";
import DirectionIcon from "../icons/directionIcon";

const ChangeDirection = (size) => {

    const [direction, setDirection] = useState("column");
    

  const changeDirection = () => {

    document.querySelector(".resource-elements").style.flexDirection = direction;
    setDirection(direction === "row" ? "column" : "row");
   }

    return (
      <div onClick={() => changeDirection()} >
      <DirectionIcon direction={(!direction == "row" ? true: false)} size={size} />
      </div>
 )

}

export default ChangeDirection
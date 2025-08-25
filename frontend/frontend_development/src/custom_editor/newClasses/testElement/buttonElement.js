import { startingMeta } from "./startingMeta";
import {useEffect, useState} from "react";
import { useHandleClick } from "../useHandleButtonClick";
export const ButtonElement= ({position,  resourceMeta, changeElement, updateResourceMeta  }) => {
  
    const [element, setElement] = useState(resourceMeta[position]);

    useEffect(()=>{
        setElement(resourceMeta[position])
    },[resourceMeta, position])




  const handleClick = useHandleClick(position, element, changeElement, startingMeta);


    return <>
    <button onClick={handleClick}>TEST</button>
    </>
}
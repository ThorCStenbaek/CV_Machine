import { startingMeta } from "./startingMeta";
import {useEffect, useState} from "react";

export const ButtonElement= ({position,  resourceMeta, changeElement, updateResourceMeta  }) => {
  
    const [element, setElement] = useState(resourceMeta[position]);

    useEffect(()=>{
        setElement(resourceMeta[position])
    },[resourceMeta, position])


    const handleClick = ()=>{
        console.log("WHAT ELEMENT",position, element, resourceMeta)
        const newElement= {...startingMeta, depth: element.depth }

        changeElement(position, newElement)
    }

    return <>
    <button onClick={handleClick}>TEST</button>
    </>
}
import { startingMeta } from "./startingMeta";
import {useEffect, useState} from "react";

import { BaseButtonElement } from './../baseButtonElement';
import TextIcon from "../../icons/textIcon";
import { mergeStyles } from "../mergeStyles";
export const ButtonElement= ({position,  resourceMeta, changeElement, updateResourceMeta  }) => {
  
    const [element, setElement] = useState(resourceMeta[position]);

    useEffect(()=>{
        setElement(resourceMeta[position])
    },[resourceMeta, position])


    const handleClick = ()=>{
        console.log("WHAT ELEMENT",position, element, resourceMeta)
        const newElement= {...startingMeta, depth: element.depth, specific_style: mergeStyles(element.specific_style, startingMeta.specific_style) }

        console.log("new element pog:", newElement, element, startingMeta)
        changeElement(position, newElement)
    }

    return <>
    <BaseButtonElement Icon={TextIcon} onClick={handleClick} name="Text"/>
  
    </>
}
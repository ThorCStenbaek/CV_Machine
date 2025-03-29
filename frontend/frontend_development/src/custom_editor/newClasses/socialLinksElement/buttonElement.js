import { startingMeta } from "./startingMeta";
import {useEffect, useState} from "react";

import { BaseButtonElement } from './../baseButtonElement';
import { SkillsIcon } from "../../icons/skillsIcon";

export const ButtonElement= ({position,  resourceMeta, changeElement, updateResourceMeta  }) => {
  
    const [element, setElement] = useState(resourceMeta[position]);

    useEffect(()=>{
        setElement(resourceMeta[position])
    },[resourceMeta, position])


    const handleClick = ()=>{
        console.log("WHAT ELEMENT",position, element, resourceMeta)
        const newElement= {...startingMeta, depth: element.depth, specific_style: element.specific_style }

        changeElement(position, newElement)
    }

    return <>
    <BaseButtonElement Icon={SkillsIcon} onClick={handleClick} name="Social"/>
  
    </>
}